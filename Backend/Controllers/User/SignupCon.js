const User = require('../../model/user')
const bcrypt = require('bcryptjs')

// --- SERVER-SIDE PASSWORD VALIDATION ---
const isStrongPassword = (password) => {
    // Requires: minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
    return passwordRegex.test(password);
};
// ---------------------------------------

async function registerUser(req,res){
    const {email,password,confirm} = req.body;
    console.log(req.body);

    if(!email || !password || !confirm){
        return res.status(400).json({message:'All fields are required'});
    }

    try{
        const userExist = await User.findEmail(email);
        if(userExist.length > 0){
            return res.status(409).json({message:"Account already exists. Login Please"});
        }
        
        if(password !== confirm){
            return res.status(400).json({message:"Password doesn't match. Try again Please"})
        }
        
        // --- 1. Password Strength Check (Crucial Server-Side Check) ---
        if(!isStrongPassword(password)){
            return res.status(400).json({message:"Password is too weak. Must be at least 8 characters and include: 1 uppercase, 1 lowercase, 1 number, and 1 special character."});
        }
        
        const hashPassword = await bcrypt.hash(password,10);
        await User.createUser(email,hashPassword);

        return res.status(201).json({message:"Account created successfully"});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Server Error. Failed to create account "})
    }
}
module.exports = registerUser;