const { NOT_FOUND } = require('http-status-codes').StatusCodes;

const notFoundMiddleware = (req, res) => {
  res.status(NOT_FOUND).send('Route not found');
};

module.exports = notFoundMiddleware;
