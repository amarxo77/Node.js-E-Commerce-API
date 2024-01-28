const jwt = require('jsonwebtoken');

const USER_ROLES = {
  admin: 'admin',
  user: 'user'
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

const generateJWTToken = (tokenUser) => {
  return jwt.sign(tokenUser, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY
  });
};

module.exports = { USER_ROLES, attachCookieToResponse, generateJWTToken };
