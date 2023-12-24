const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateDB = (err) => {
  const message = `Duplicate field value: ${
    Object.values(err.keyValue)[0]
  }. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const list = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${list.join('. ')}`;
  return new AppError(message, 400);
};

// JWT errors handle
const handleJWTError = () =>
  new AppError('Invalid token. Please login again!', 401);

const handleJWTExpires = () =>
  new AppError(
    'Your login session is about to expire. Please login again!',
    401,
  );

const sendErrorDev = (err, req, res) => {
  // A) API HANDLE
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
    // B) RENDER SITE HANDLE
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Uh oh! Something went wrong!',
      message: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // A) API HANDLE
  if (req.originalUrl.startsWith('/api')) {
    // Operaional, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // Programming or orther unknown error:don't leak error details
    } else {
      // 1) Log error
      console.log('ERROR 💥', err);

      // 2) Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  }
  // B) SITE RENDER HANDLE
  else {
    // 1) Operational, trus error, send message to client
    if (err.isOperational) {
      return res.render('error', {
        title: 'Uh oh! Something went wrong!',
        message: err.message,
      });
    }
    // 2) Send generic message
    console.log('ERROR 💥', err);
    res.status(err.statusCode).render('error', {
      title: 'Uh oh! Something went wrong!',
      message: 'Please try again later!',
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateDB(error);
    if (error.errors) error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpires();

    sendErrorProd(error, req, res);
  }
};
