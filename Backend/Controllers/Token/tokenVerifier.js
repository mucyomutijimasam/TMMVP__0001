const User = require('../../model/user')

exports.getMe = async (req,res,next) =>{
try {
    const user = await User.findById(req.user.id);
    if(!user){
        return res.status(404).json({ok: false, error: 'User not found'})
    };
    res.status(200).json({ok:true, user});
} catch (error) {
    next(error)
}
}