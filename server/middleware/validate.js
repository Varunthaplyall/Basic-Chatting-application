const {registerSchema} = require('../validation/user.validation');

const userValidation = (req,res,next)=>{
    const body = req.body;
    const {error, value} = registerSchema.validate(body);

    if(error){
        console.log(error);
        res.status(400).json({message : error.details[0].message} )
    }else{
        next()
    }
}

module.exports = {
    userValidation
}