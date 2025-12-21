const Joi = require('joi');

module.exports = Joi.object({
  sessionId: Joi.number().integer().positive().required(),
  messageId: Joi.number().integer().positive().optional()
});
