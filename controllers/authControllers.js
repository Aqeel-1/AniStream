/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
const util = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirme: req.body.passwordConfirme,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('you sholud provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError('Incorrect email or password, login failed!', 401),
    );
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Check if there is a token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('user not logged in!', 401));
  }
  // Check if this token correct and it is a real token
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY,
  );
  // Check if user still exist
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does not longer exist!',
        401,
      ),
    );
  }
  // Check if user dosen't change its  password
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User Changed its password!! please login again!!', 401),
    );
  }
  req.user = freshUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to do this action', 403),
      );
    }
    next();
  };

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('there is no user with this email!', 404));
  }
  // 2) Generate a random reset token

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send this token back to user's email
  const message = `forget your password? you need to enter this token in the resetPassword field:
    token : ${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'reset your password token (valid in 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'the token to reset your password send to your email!!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('there was an error to send email! try again later!', 500),
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based in the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // if the token has not expiered and there is a user, set new password

  if (!user) {
    return next(new AppError('token in invalid or has expiered!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirme = req.body.passwordConfirme;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // Change changedPasswordAt property for the user (done in pre middelwere)
  // log the user in and set jwt
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
