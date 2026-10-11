const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({message: messages.join(', ')})
  }

  if (err.name === 'CastError') {
    return res.status(400).json({message: 'Invalid ID or value format'})
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message || 'Something went wrong' });
};

module.exports = { notFound, errorHandler };
