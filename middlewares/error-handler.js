const { BAD_REQUEST, INTERNAL_SERVER_ERROR } =
  require('http-status-codes').StatusCodes;

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    message: err.message ?? 'Something went wrong please check the server code',
    statusCode: err.statusCode ?? INTERNAL_SERVER_ERROR
  };
  if (err?.name === 'ValidationError' && Object.keys(err?.errors).length > 0) {
    customError.message = Object.keys(err.errors)
      .map((value) => err.errors[value].message)
      .join(', ');
    customError.statusCode = BAD_REQUEST;
  }
  if (err?.code === 11000 && err?.keyValue?.email) {
    customError.message = `email with an email address ${err?.keyValue?.email} already exists. Please try to registering with a different email address`;
    customError.statusCode = BAD_REQUEST;
  }
  res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;
