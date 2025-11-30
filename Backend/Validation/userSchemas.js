// validation/userValidation.js
const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().max(255).required(),
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/[a-z]/, 'lowercase')
    .pattern(/\d/, 'number')
    .pattern(/[^a-zA-Z0-9]/, 'special character')
    .required(),
  confirm: Joi.string().valid(Joi.ref('password')).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(8).max(64).required()
});


module.exports = { registerSchema, loginSchema };
