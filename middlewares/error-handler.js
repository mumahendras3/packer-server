function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'This email has already been registered'
    });
  }
  if (err.errors) {
    const [field] = Object.keys(err.errors);
    const { message } = err.errors[field];
    return res.status(400).json({ message });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}

module.exports = errorHandler;