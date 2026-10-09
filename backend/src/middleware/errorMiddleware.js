const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message || 'Something went wrong' });
};

module.exports = { notFound, errorHandler };
