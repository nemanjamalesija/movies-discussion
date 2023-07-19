import { Request, Response, NextFunction } from 'express';
import catchAsync from '../helpers/catchAsync.ts';
import User from '../models/User.ts';
import controllerFactory from './controllerFactory.ts';

const getAllUsers = controllerFactory.getAll(User);
const createUser = controllerFactory.createOne(User);

const getOneUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'friends',
        select: ['name', 'lastName', 'photo'],
      })
      .populate({
        path: 'friendRequests',
        select: ['name', 'lastName', 'photo'],
      });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return next();
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  }
);

const addFriend = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userToAdd = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.currentUser.id);

    if (!userToAdd || !currentUser) {
      res.status(404).json({ error: 'This user does not exist' });
      return next();
    }

    if (userToAdd.id === currentUser.id) {
      res.status(404).json({ error: 'You cannot add yourself as a friend' });
      return next();
    }

    if (userToAdd.friendRequests.includes(currentUser.id)) {
      res.status(400).json({ error: 'Already requested' });
      return next();
    }

    if (currentUser.friends.includes(userToAdd.id)) {
      res
        .status(400)
        .json({ error: 'This person is already in your friends list.' });
      return next();
    }

    userToAdd.friendRequests = [...userToAdd.friendRequests, currentUser.id];

    await userToAdd.save({ validateBeforeSave: false });
    res.status(200).json({
      status: 'success',
      message: 'Request sucessfully sent',
    });
  }
);

const acceptFriend = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRequesting = await User.findById(req.body.id);
    const currentUser = await User.findById(req.body.currentUser.id);

    if (!userRequesting || !currentUser) {
      res.status(400).json({ error: 'This user does not exist' });
      return next();
    }

    if (
      userRequesting.friends.includes(currentUser.id) ||
      currentUser.friends.includes(userRequesting.id)
    ) {
      res.status(400).json({ error: 'You are already friend with this user.' });
      return next();
    }

    currentUser.friends.push(userRequesting.id);
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== userRequesting.id
    );

    userRequesting.friends.push(currentUser.id);

    await currentUser.save({ validateBeforeSave: false });
    await userRequesting.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'User accepted to your friend list!',
    });
  }
);

export default { getAllUsers, createUser, addFriend, acceptFriend, getOneUser };
