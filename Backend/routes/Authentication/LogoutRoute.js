const express = require('express')
const router = express.Router()
const {logout} = require('../../Controllers/User/userController')

router.post('/',logout)

module.exports = router