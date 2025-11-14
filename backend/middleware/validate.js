exports.validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: err.errors.map(e => e.message)
    });
  }
};
