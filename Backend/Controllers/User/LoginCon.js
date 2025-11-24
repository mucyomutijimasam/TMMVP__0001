const User = require('../../Model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

async function logIn(req,res){
    const {email,password} = req.body;
    console.log(req.body)
    try{
        const userExist = await User.findEmail(email)

        if(!userExist){
            return res.status(404).json({message:"User not found"})
        }

        const user = userExist[0]
        const  passwordMatch = await bcrypt.compare(password,user.passwordHash)
        if(!passwordMatch){
            return res.status(404).json({message:"Invalid credentials"})

        }
        const token = jwt.sign({email},process.env.JWT,{expiresIn: process.env.EXPIRE})
        console.log('User logged in successfully')
        return res.status(200).json({message:"Logged Successfully",token,user:{id:user.id,email:user.email}})
        
    }catch(error){
        console.error(error)
        return res.status(500).json({message:'Server Error.failed to login'})
    }
}
module.exports = logIn;