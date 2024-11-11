const router = require('express').Router()
const {Login, Register, findId, users} = require('../controller/authController');
const { tokenValidation } = require('../middleware/tokenCheck');
const { userValidation } = require('../middleware/validate');
const userModel = require('../model/user.model');

router.post('/register',userValidation,Register)
router.post('/login',Login)
router.get('/verify', tokenValidation, (req,res)=>{
    res.status(200).json({message : 'user verified'})
})






module.exports = router;
