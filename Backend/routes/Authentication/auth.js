// routes/auth/index.js
const express = require('express');
const router = express.Router();

router.use('/signup', require('./SignupRoutes'));
router.use('/login', require('./LoginRoute'));

module.exports = router;
