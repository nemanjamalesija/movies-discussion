import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors.ts';
import { Error } from 'mongoose';
import { MongoError } from 'mongodb';

const sendError = (res: Response, err: any) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);
    console.log(err.stack);
    console.log(err.message);
    res.status(err.statusCode || 500).json({
      status: err.status,
      error: err,
      message: err.message,
    });
  }
};

const handleCastErrorDB = (err: Error.CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 404);
};

const handleDuplicateFieldErrorDB = (err: any) => {
  const productName = err.keyValue.email;
  const userEmail = err.keyValue.email;
  let message: string = '';

  if (productName)
    message = `The product under the name ${productName} already exists`;

  if (userEmail)
    message = `The user under the email ${userEmail} already exists`;

  return new AppError(message, 404);
};

const handleValidatorErrorDB = (err: Error.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 404);
};

const errorController = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };

  // MONGO DB ERRORS
  // 1. Cast error
  if (err.name === 'CastError')
    error = handleCastErrorDB(error as Error.CastError);

  // 2. Email already exist
  if (err.code === 11000)
    error = handleDuplicateFieldErrorDB(error as MongoError);

  // 3. Didn't specify all fields
  if (err.name === 'ValidationError')
    error = handleValidatorErrorDB(error as Error.ValidationError);

  sendError(res, error);
};

export default errorController;
