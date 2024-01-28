const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { USER_ROLES } = require('../utils');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Username is required'],
    minLength: [3, 'Username should be at least 3 characters long.'],
    maxLength: [40, 'Username cannot be greater than 40 characters.']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: (value) => isEmail(value),
      message: '`{VALUE}` is not a valid email.'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password should be at least 6 characters long.']
  },
  role: {
    type: String,
    enum: {
      values: Object.values(USER_ROLES),
      message: 'Invalid role value - `{VALUE}`'
    },
    default: USER_ROLES.user
  }
});

userSchema.pre('save', async function () {
  return (this.password = await bcrypt.hash(this.password, 10));
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.verifyJWTToken = function (token) {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = model('User', userSchema);
