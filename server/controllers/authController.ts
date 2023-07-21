import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../helpers/catchAsync.ts';
import User from '../models/User.ts';
import { UserType } from '../types/User.ts';
import { AppError } from '../helpers/appError.ts';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '90d',
  });
};

const createSendToken = (res: Response, statusCode: number, user: UserType) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        ...user.toObject(),
        password: undefined,
      },
    },
  });
};

const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, lastName, email, password, passwordConfirm, role } = req.body;

    // 1. Create new user
    const newUser = await User.create({
      name,
      lastName,
      email,
      role,
      password,
      passwordConfirm,
    });

    // 2. Sign token an send success response
    createSendToken(res, 201, newUser as UserType);
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, photo } = req.body;

    // 1. Check if email and password exist
    if (!email || !password) {
      const error = new Error('Please provide both email and password');

      return next(error);
    }

    // 2. Check if the user exists && password is correct
    const currentUser = await User.findOne({ email }).select('+password');

    if (
      !currentUser ||
      !(await currentUser.correctPassword(password, currentUser.password))
    ) {
      const error = new Error('Incorrect email or password');

      next(error);
    } else {
      // 3. If everything ok, send token to client
      createSendToken(res, 200, currentUser as UserType);
    }
  }
);

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Get the token and check if it exists
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Validate the token
  const decodeTokenFn: (token: string, secret: string) => Promise<any> =
    promisify(jwt.verify);

  let decodedTokenObj;

  try {
    decodedTokenObj = await decodeTokenFn(
      token as string,
      process.env.JWT_SECRET as string
    );
  } catch (error) {
    res.status(400).json({ error: 'This token is not valid.' });
    return next();
  }

  // 3. Check if user still exists
  const currentUser = await User.findById(decodedTokenObj.id);

  if (!currentUser) {
    const message = 'The user belonging to the token no longer exists';
    const error = new Error(message);

    return next(error);
  }

  return currentUser;
};

const getUserWithToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = await authenticateUser(req, res, next);

    if (currentUser) {
      res.status(200).json({
        status: 'success',
        data: {
          user: currentUser,
        },
      });
    } else {
      return next();
    }
  }
);

const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = await authenticateUser(req, res, next);

    if (!currentUser) return next(new AppError('User not found', 404));

    req.body = { ...req.body, currentUser };
    return next();
  }
);

const logout = (req: Request, res: Response) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success' });
};

export default {
  signUp,
  login,
  getUserWithToken,
  logout,
  protect,
};
