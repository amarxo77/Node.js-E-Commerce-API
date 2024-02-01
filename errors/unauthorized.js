const { FORBIDDEN } = require('http-status-codes').StatusCodes;

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

module.exports = UnauthorizedError;
