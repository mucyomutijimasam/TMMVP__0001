const User = require('../../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

async function logIn(req,res){
    const {email,password} = req.body;
    console.log(req.body)
    
    // --- Use a proper secret variable from env ---
    const JWT_SECRET = process.env.JWT_SECRET; 
    const EXPIRE_TIME = process.env.TOKEN_EXPIRY || '1h'; // Default to 1 hour if not set

    if (!JWT_SECRET) {
        // Essential security check
        return res.status(500).json({message: 'Server configuration error: JWT secret not set.'});
    }

    try{
        const userExist = await User.findEmail(email)

        if(!userExist || userExist.length === 0){
            return res.status(404).json({message:"Invalid credentials"}) // Changed to be less specific for security
        }

        const user = userExist[0]
        const passwordMatch = await bcrypt.compare(password,user.passwordHash)
        
        if(!passwordMatch){
            return res.status(404).json({message:"Invalid credentials"}) // Changed to be less specific for security
        }
        
        // --- JWT with 1-hour expiration ---
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Use id and email as payload
            JWT_SECRET,
            { expiresIn: EXPIRE_TIME } // Set expiration time (e.g., '1h')
        )
        
        console.log('User logged in successfully')
        
        // Send a secure HTTP-Only cookie for the token (BETTER security improvement)
        res.cookie('auth_token', token, {
            httpOnly: true, // Prevents client-side JS from accessing it
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            maxAge: 3600000 // 1 hour in milliseconds
        });
        
        // Return token in body as well for client-side use/testing
        return res.status(200).json({
            message:"Logged In Successfully",
            token: token, // Returning in body for client to store/use in headers
            user:{id:user.id,email:user.email}
        })
        
    }catch(error){console.error("--- Login Error Details ---");
        console.error("Error Message:", error.message);
        console.error("Stack Trace:", error.stack);
        // If using mysql2, it might also provide database-specific codes:
        if (error.code) console.error("MySQL Error Code:", error.code); 
        console.error("-------------------------");
        
        return res.status(500).json({message:'Server Error. Failed to login'})
    }
}
module.exports = logIn;