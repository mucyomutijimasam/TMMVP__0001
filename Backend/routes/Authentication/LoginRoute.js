const express = require('express');
const router = express.Router();
const { logIn, refresh, logout } = require('../../Controllers/User/userController');
const validate = require('../../Middleware/validate');
const { loginSchema } = require('../../Validation/userSchemas');

// POST /api/auth/login/
router.post('/', validate(loginSchema), logIn);

// POST /api/auth/login/refresh
// No validation schema needed usually as it reads from cookies
router.post('/refresh', refresh);

// POST /api/auth/login/logout
router.post('/logout', logout);

module.exports = router;