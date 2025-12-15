module.exports = (schema, property = 'body') => {
  return (req, res, next) => {
    const data =
      property === 'params' ? req.params :
      property === 'query' ? req.query :
      req.body;

    const { error } = schema.validate(data, { abortEarly: true });

    if (error) {
      return res.status(400).json({
        ok: false,
        error: error.details[0].message
      });
    }

    next();
  };
};
