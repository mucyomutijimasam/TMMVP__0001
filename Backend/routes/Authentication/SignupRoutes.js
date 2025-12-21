const express = require('express');
const router = express.Router();
const { registerUser } = require('../../Controllers/User/userController');
const validate = require('../../Middleware/validate');
const { registerSchema } = require('../../Validation/userSchemas');

// POST /api/auth/signup/
router.post('/', validate(registerSchema), registerUser);

module.exports = router;