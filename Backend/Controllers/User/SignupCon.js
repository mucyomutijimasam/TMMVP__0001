const User = require('../../Model/user')
const bcrypt = require('bcryptjs')

async function registerUser(req,res){
    const {email,password,confirm} = req.body;
    console.log(req.body);

    if(!email || !password || !confirm){
        return res.status(400).json({message:'All fields are required'});
    
    }

    try{
        const userExist = await User.findEmail(email);
        if(userExist.length > 0){
            return res.status(409).json({message:"Account already exists.Login Please"});
        }
        if(password !== confirm){
            return res.status(400).json({message:"Password doesn't match.Try again Please"})
        }
        const hashPassword = await bcrypt.hash(password,10);
        await User.createUser(email,hashPassword);

        return res.status(201).json({message:"Account created successfully"});
    }catch(error){
        console.error(error);
        return res.status(500).json({error:"Server Error.failed to create account "})
    }
    
}
module.exports = registerUser;