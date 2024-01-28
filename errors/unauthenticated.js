const { UNAUTHORIZED } = require('http-status-codes').StatusCodes;

class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;
