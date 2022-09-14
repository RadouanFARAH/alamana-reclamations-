const Joi = require('@hapi/joi');

const loginValidation = (data)=>{
    const Schema ={
        sAMAccountName : Joi.string().required(),
        password : Joi.string().required(),
    };
    return Joi.validate(data,Schema);
}

module.exports = {
    loginValidation,
}