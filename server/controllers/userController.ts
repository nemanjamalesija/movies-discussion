import { Request, Response, NextFunction } from 'express';
import catchAsync from '../helpers/catchAsync.ts';
import User from '../models/User.ts';
import controllerFactory from './controllerFactory.ts';

const getAllUsers = controllerFactory.getAll(User);
const createUser = controllerFactory.createOne(User);

const addFriend = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {});

export default { getAllUsers, createUser };
