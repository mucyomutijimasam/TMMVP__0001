const express = require('express')
const route = express.Router()
const registerUser = require('../../Controllers/User/SignupCon')

route.post('',registerUser)

module.exports = route