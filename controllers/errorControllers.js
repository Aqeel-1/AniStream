/* eslint-disable node/no-missing-require */
/* eslint-disable import/no-unresolved */
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicatedValueErrorDB = (err) => {
  // Extract the key and value dynamically from err.keyValue
  const field = Object.keys(err.keyValue)[0]; // Get the first key from the keyValue object
  const value = err.keyValue[field]; // Get the value of that key

  const message = `Duplicated value for field ${field}: ${value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const messages = Object.values(err.errors).map((element) => element.message);
  const errorMessage = `Invalid data input: ${messages.join('. ')}`;
  return new AppError(errorMessage, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // if the error is operatinal error, trusted error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error:
  } else {
    // 1) Log the error to the console
    console.error('#-----Error-----#\n', err);
    // 2) send back generic error message
    res.status(500).json({
      status: 'error',
      message: 'Unexcepted unknown error!!!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(
      Object.getPrototypeOf(err),
      Object.getOwnPropertyDescriptors(err),
    );

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicatedValueErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};
