// validation/messageSchema.js
const Joi = require('joi');

module.exports = Joi.object({
  sender: Joi.string().valid('user', 'assistant').optional(),
  content: Joi.string().trim().min(1).max(5000).required(),
});
