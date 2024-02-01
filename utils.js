const jwt = require('jsonwebtoken');
const { connect } = require('mongoose');
const { UnauthorizedError } = require('./errors');

const USER_ROLES = {
  admin: 'admin',
  user: 'user'
};

const connectDB = async () => {
  await connect(process.env.MONGO_URI);
  console.log('connected to the database');
};

const attachCookieToResponse = (response, tokenUser) => {
  const token = generateJWTToken(tokenUser);
  response.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
    signed: true
  });
};

const checkIsSameUser = (user, resourceUserId) => {
  if (user.role === 'admin' || user.userId === resourceUserId.toHexString())
    return;
  throw new UnauthorizedError('Not authorized to access this route.');
};

const generateJWTToken = (tokenUser) => {
  return jwt.sign(tokenUser, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY
  });
};

const generateTokenUser = (user) => {
  return { name: user.name, userId: user._id, role: user.role };
};

const verifyJWTToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  USER_ROLES,
  attachCookieToResponse,
  checkIsSameUser,
  connectDB,
  generateJWTToken,
  generateTokenUser,
  verifyJWTToken
};
