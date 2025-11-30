// validation/sessionSchemas.js
const Joi = require('joi');

const endSessionSchema = Joi.object({
  summary: Joi.string().max(5000).allow(null, ''),
});

module.exports = { endSessionSchema };
