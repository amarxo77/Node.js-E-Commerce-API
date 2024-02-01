const { UnauthenticatedError, UnauthorizedError } = require('../errors');
const { verifyJWTToken } = require('../utils');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) throw new UnauthenticatedError('Authentication Invalid.');
  try {
    const { name, userId, role } = verifyJWTToken(token);
    req.user = { name, userId, role };
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError('Authentication Invalid.');
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin' || req.user.role === 'user')
    throw new UnauthorizedError('Not authorized to use this route.');
  next();
};

module.exports = { authenticateUser, isAdmin };
