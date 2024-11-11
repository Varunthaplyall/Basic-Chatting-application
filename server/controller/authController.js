const bcrypt = require('bcrypt')
const {createToken} = require('../utils/createToken')
const userModel = require('../model/user.model')



const Register = async (req,res)=>{
    try {
        const {userName, email, password } = req.body;

        const userExist = await userModel.findOne({email});
        if(userExist){
           return res.status(409).json({message : 'user already exist'})
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const createUser = await userModel.create({userName, email, password : hashedPassword});

        const token = createToken({
            id : createUser._id
        });

        return res.status(201).json({
            success : true,
            message : "user created sucessfully",
            id : createUser._id,
            email : createUser.email,
            userName : createUser.userName,
            token : token,
        });
    } catch (error) {
        console.log('Error ocurred while creating user :', error)
        return res.status(500).json({
            message : "Internal server error"
        })
    }
}


const Login = async (req, res)=>{
    try {
        const {email, password} = req.body;


    const user = await userModel.findOne({email});

    if(user){
        const isValid = await bcrypt.compare(password, user.password)

        if(!isValid){
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials"
            })
        }

        const token = createToken({
            id : user._id
        });

        return res.status(200).json({
            success : true,
            message : "user logged in sucessfully",
            userName : user.userName,
            email : user.email,
            id : user._id,
            token : token
        })
    }

    res.status(400).json({
        success : false,
        message : "invalid credentials"
    })
    } catch (error) {
        res.status(500).json({
            message : "Something went wrong"
        })
        console.log('Error ocurred while logging in :', error)
    }
}


const findId = async (req,res)=>{
    const {userId} = req.params

    try {
        const user = await userModel.findById(userId);
        res.status(200).json({user})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal server error"})
    }
}

const users = async(req,res)=>{
    try {
        const user = await userModel.find({}, 'userName _id');
    res.status(200).json({user})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal server error"})
    }
}

module.exports = {
    Login,
    Register,
    findId,
    users

}