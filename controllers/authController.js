const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');

const AppError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const Email = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  const cookieOptiops = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptiops.secure = true;
  }

  res.cookie('jwt', token, cookieOptiops);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Delete password from output
  newUser.password = undefined;
  const url = `${req.protocol}://${req.get('host')}/me`;

  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email or password exist
  if (!email || !password) {
    return next(new AppError('You need enter email and password!', 400));
  }
  // 2) Check if user exist or password incorrect
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email or password incorrect!', 400));
  }

  // 3) If everything work correct, send token to user
  createSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  const cookieOptiops = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptiops.secure = true;
  }
  res.cookie('jwt', 'loggedout', cookieOptiops);

  res.status(200).json({
    status: 'success',
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get JWT token from header and check if JWT token exist
  // console.log(req.headers);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        'You have not logged in. Please log in to gain access!',
        401,
      ),
    );
  }
  // 2) Verify JWT token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user exist
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('User does not exist!', 401));
  }
  // 4) Check if user change password after JWT token issue
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Your password has been successfully changed. Please login again!',
        401,
      ),
    );
  }
  // 5) GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLogged = catchAsync(async (req, res, next) => {
  // 1) Get JWT token from header and check if JWT token exist
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next();
  }

  try {
    // 2) Verify JWT token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user exist
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next();
    }
    // 4) Check if user change password after JWT token issue
    if (currentUser.changePasswordAfter(decoded.iat)) {
      return next();
    }

    // 5) Pass user data to pug template
    res.locals.user = currentUser;
  } catch (err) {
    return next();
  }

  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Permission deny', 403));
    }
    next();
  };

exports.forgotPassword = async (req, res, next) => {
  // 1) Check if email exist
  if (!req.body.email) {
    return next(new AppError('Email can not be empty!', 400));
  }
  // 2) Check user exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User with email does not exist!', 400));
  }
  // 3) Generate the random reset token
  const resetToken = user.generateResetToken();

  // 3) Save resetPasswordAt
  await user.save({ validateBeforeSave: false });

  // 4) Send email to user for confirm new password
  // console.log('req', res);

  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  // 3) Send it to user's email
  try {
    await new Email(user, resetURL).sendPasswordReset();

    res.json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });
    return next(new AppError('Email reset password link sent error'));
  }
};

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user base on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gte: Date.now(),
    },
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token invalid or expired!', 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // Must use 'save' when update user. Cause validate (password, ...) middleware only work for 'save'
  await user.save();

  // 3) Update changePasswordAt property for user - handle by mongoose hook

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  if (!req.body.passwordCurrent) {
    return next(new AppError('You need enter password!', 400));
  }
  const user = await User.findById(req.user._id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError('Password incorrect!', 401));
  }
  // 3) If so update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 3) Log user in, send JWT
  createSendToken(user, 200, res);
});
