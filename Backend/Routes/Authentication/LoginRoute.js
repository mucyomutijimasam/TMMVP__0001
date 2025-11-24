const express = require('express')
const route = express.Router()
const logIn  = require('../../Controllers/User/LoginCon')

route.post('',logIn)

module.exports = route