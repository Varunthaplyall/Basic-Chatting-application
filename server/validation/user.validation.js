const joi = require('joi');


const registerSchema = joi.object({
    userName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
});


module.exports = {
    registerSchema
}