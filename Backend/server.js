const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
app.use(cors())
app.use(express.json())

//Application Port
const port = process.env.PORT

//Database Configuration
const {testConnection} = require('./Config/db')


//Authentication Configurations
const registerUser = require('./Routes/Authentication/SignupRoutes')
const logIn = require('./Routes/Authentication/LoginRoute')

app.use('/signup',registerUser)
app.use('/login',logIn)


app.listen(port,()=>{
    testConnection()
    console.log(`Application is running on http://localhost:${port}`)
})