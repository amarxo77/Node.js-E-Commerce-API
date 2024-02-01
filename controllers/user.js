const { OK } = require('http-status-codes').StatusCodes;
const UserModel = require('../models/User');
const { NotFoundError, BadRequestError } = require('../errors');
const {
  generateTokenUser,
  attachCookieToResponse,
  checkIsSameUser
} = require('../utils');

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await UserModel.find({ role: 'user' })
    .select('-password')
    .sort('name');
  res.status(OK).json({ users });
};
const getSingleUser = async (req, res) => {
  const userId = req.params.id;
  const user = await UserModel.findById(userId).select('-password');
  if (!user) throw new NotFoundError(`No user with id ${userId}.`);
  checkIsSameUser(req.user, user._id);
  res.status(OK).json({ user });
};
const showCurrentUser = async (req, res) => {
  res.status(OK).json({ user: req.user });
};
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name)
    throw new BadRequestError('Please provide valid email and name');
  const user = await UserModel.findByIdAndUpdate(
    req.user.userId,
    { email, name },
    { runValidators: true, new: true }
  );
  const tokenUser = generateTokenUser(user);
  attachCookieToResponse(res, tokenUser);
  res.status(OK).json({ user: tokenUser });
};
const updateUserPassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword },
    user: { userId }
  } = req;
  if (!oldPassword || !newPassword)
    throw new BadRequestError('Please provide old and new passwords');
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError(`No user with id ${userId}.`);
  const isPasswordMatch = await user.comparePassword(oldPassword);
  if (!isPasswordMatch) throw new BadRequestError('Invalid Credentials');
  user.password = newPassword;
  await user.save({ validateBeforeSave: true });
  res.status(OK).json({ msg: 'Success! Password updated', user });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
};
