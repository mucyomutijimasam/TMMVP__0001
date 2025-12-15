// validation/userValidation.js
const Joi = require('joi');

const registerSchema = Joi.object({
  // *** ADDED USERNAME FIELD HERE ***
  username: Joi.string()
    .alphanum() // Restrict to alphanumeric for clean URLs/handles
    .min(3)
    .max(150)
    .required(), 
  // ********************************

  email: Joi.string().email().max(255).required(),
  
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/[a-z]/, 'lowercase')
    .pattern(/\d/, 'number')
    .pattern(/[^a-zA-Z0-9]/, 'special character')
    .required(),
    
  // Joi.ref('password') ensures the 'confirm' field matches the 'password' field
  confirm: Joi.string().valid(Joi.ref('password')).required()
    // You can use .strip() here if your middleware doesn't do it automatically 
    // and you want to ensure 'confirm' is removed from the final req.body for the controller
});

const loginSchema = Joi.object({
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(8).max(64).required()
});

module.exports = { registerSchema, loginSchema };