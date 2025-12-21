const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Extract token from Header or Cookies
  const authHeader = req.headers.authorization;
  const token = (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null) 
                || req.cookies?.auth_token;

  // 2. Immediate exit if no token
  if (!token) {
    return res.status(401).json({ ok: false, error: 'Access denied. No token provided.' });
  }

  try {
    // 3. Verify and attach user to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // 4. Handle expired or tampered tokens
    return res.status(401).json({ ok: false, error: 'Invalid or expired token.' });
  }
};