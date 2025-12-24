// routes/auth/index.js
const express = require('express');
const router = express.Router();
const token = require('../../Controllers/Token/tokenVerifier')
const Middleware = require('../../Middleware/verifyToken')
const authController = require('../../Controllers/User/userController')

router.use('/signup', require('./SignupRoutes'));
router.use('/login', require('./LoginRoute'));
router.use('/logout',require('./LogoutRoute'))

router.post('/refresh',authController.refresh)
router.use('/me',Middleware,token.getMe)

module.exports = router;
