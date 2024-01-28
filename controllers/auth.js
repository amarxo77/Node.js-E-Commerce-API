const { CREATED, OK } = require('http-status-codes').StatusCodes;
const UserModel = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { attachCookieToResponse } = require('../utils');

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const role = !(await UserModel.find({})).length ? 'admin' : 'user';
  const user = await UserModel.create({ email, name, password, role });
  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookieToResponse(res, tokenUser);
  return res.status(CREATED).json({ user: tokenUser });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError('Please provide valid email and password');
  const user = await UserModel.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    throw new UnauthenticatedError('Please provide valid user credentials');
  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookieToResponse(res, tokenUser);
  return res.status(OK).json({ user: tokenUser });
};
const logout = async (req, res) => {
  return res
    .cookie('token', '', {
      expires: new Date(0)
    })
    .status(OK)
    .json({ msg: 'user logged out.' });
};

module.exports = {
  login,
  logout,
  register
};
