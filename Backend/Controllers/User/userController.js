const User = require('../../model/user');
const pool = require('../../config/db'); // Direct pool access for refresh_token table
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { 
  generateAccessToken, 
  generateRefreshToken 
} = require('../../utils/token');

require('dotenv').config();

/**
 * REGISTER USER
 */
async function registerUser(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ ok: false, error: 'Account already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const created = await User.createUser(username, email, hash);
    
    return res.status(201).json({ ok: true, data: { id: created.insertId } });
  } catch (err) {
    return next(err);
  }
}

/**
 * LOGIN (Version 2 Strategy)
 */
async function logIn(req, res, next) {
  try {
    const { email, password } = req.body;

    // 1. Find User
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }

    // 2. Compare Password (Note: match with your DB column name, e.g., passwordHash)
    const match = await bcrypt.compare(password, user.passwordHash || user.password);
    if (!match) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }

    // 3. Generate Split Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 4. Store Refresh Token in DB
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) 
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [user.id, refreshToken]
    );

    // 5. Set HttpOnly Cookie for Refresh Token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // 6. Send Access Token in JSON body
    return res.json({ 
      ok: true, 
      data: { 
        accessToken, 
        user: { id: user.id, email: user.email, username: user.username } 
      } 
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * REFRESH TOKEN
 */
async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ ok: false, error: 'No refresh token' });

    // Verify token validity
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Check if it exists in DB and isn't revoked
    const [rows] = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = ? AND revoked = false',
      [token]
    );

    if (!rows.length) {
      return res.status(403).json({ ok: false, error: 'Refresh token revoked or invalid' });
    }

    // Generate new Access Token
    const accessToken = generateAccessToken({ id: payload.id, email: payload.email });
    
    res.json({ ok: true, accessToken });
  } catch (err) {
    // If token is expired or tampered with, jwt.verify throws an error
    return res.status(403).json({ ok: false, error: 'Invalid refresh token' });
  }
}

/**
 * LOGOUT
 */
async function logout(req, res, next) {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      // Invalidate in Database
      await pool.query(
        'UPDATE refresh_tokens SET revoked = true WHERE token = ?',
        [token]
      );
    }

    // Clear the cookie
    res.clearCookie('refreshToken');
    res.json({ ok: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerUser, logIn, refresh, logout };