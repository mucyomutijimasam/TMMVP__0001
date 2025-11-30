// controllers/userController.js
const User = require('../../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '1h';

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET not set');
  // do not throw here, but login/signup will error out gracefully
}

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

async function logIn(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 // 1 hour
    });

    return res.json({ ok: true, data: { token, user: { id: user.id, email: user.email, username: user.username } } });
  } catch (err) {
    return next(err);
  }
}

module.exports = { registerUser, logIn };
