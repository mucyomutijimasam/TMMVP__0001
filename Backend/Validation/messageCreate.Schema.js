const Joi = require('joi');

module.exports = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required(),
  sender: Joi.string().valid('user', 'assistant').optional(),
  emotion_detected: Joi.object().optional().allow(null)
});
