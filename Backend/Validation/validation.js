module.exports = (schema, property = 'body') => {
  return (req, res, next) => {
    // 1. Determine data source (from Version 1)
    const data =
      property === 'params' ? req.params :
      property === 'query' ? req.query :
      req.body;

    // 2. Options for robust validation (from Version 2)
    const options = {
      abortEarly: false,     // Collect all errors (Better UX)
      allowUnknown: false,   // Don't allow fields not in schema
      stripUnknown: true     // Remove fields not in schema (Security/Clean-up)
    };
    
    const { error, value } = schema.validate(data, options);

    if (error) {
      // 3. Return all errors (from Version 2)
      return res.status(400).json({
        ok: false,
        message: 'Validation failed',
        errors: error.details.map(d => d.message)
      });
    }

    // 4. Update the validated property (from Version 2's logic)
    if (property === 'params') {
      req.params = value;
    } else if (property === 'query') {
      req.query = value;
    } else {
      req.body = value;
    }
    
    next();
  };
};