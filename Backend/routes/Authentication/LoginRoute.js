// routes/auth/login.js
const express = require('express');
const router = express.Router();
const { logIn } = require('../../Controllers/User/userController');
const validate = require('../../Middleware/validate');
const { loginSchema } = require('../../Validation/userSchemas');

router.post('/', validate(loginSchema), logIn);

module.exports = router;
