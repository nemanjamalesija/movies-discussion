import { Request, Response, NextFunction } from 'express';
import catchAsync from '../helpers/catchAsync.ts';
import User from '../models/User.ts';
import controllerFactory from './controllerFactory.ts';

const getAllUsers = controllerFactory.getAll(User);
const createUser = controllerFactory.createOne(User);

const addFriend = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userToAdd = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.currentUser._id);

    if (!userToAdd || !currentUser) {
      res.status(404).json({ error: 'This user does not exist' });
      return next();
    }

    if (userToAdd._id === currentUser._id) {
      res.status(404).json({ error: 'You cannot add yourself as a friend' });
      return next();
    }

    if (userToAdd.friendRequests.includes(currentUser._id)) {
      res.status(400).json({ error: 'Already requested' });
      return next();
    }

    if (currentUser.friends.includes(userToAdd._id)) {
      res
        .status(400)
        .json({ error: 'This person is already in your friends list.' });
      return next();
    }

    await User.findByIdAndUpdate(
      userToAdd._id,
      { friendRequests: [...userToAdd.friendRequests, currentUser._id] },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'User succesfully added!',
    });
  }
);

export default { getAllUsers, createUser, addFriend };
