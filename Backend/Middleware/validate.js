// middleware/validate.js
module.exports = (schema, target = 'body') => (req, res, next) => {
  const data = target === 'params' ? req.params : req[target];
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({ ok: false, errors: messages });
  }
  return next();
};
