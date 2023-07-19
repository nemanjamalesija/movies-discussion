import { Request, Response, NextFunction } from 'express';
import catchAsync from '../helpers/catchAsync.ts';
import User from '../models/User.ts';
import controllerFactory from './controllerFactory.ts';
import { UserType } from '../types/User.ts';

const getAllUsers = controllerFactory.getAll(User);
const createUser = controllerFactory.createOne(User);

const getOneUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let activeUser: UserType;
    let isAlreadyFriends = false;
    let isFriendRequested = false;

    const targetUser = await User.findById(req.params.id)
      .populate({
        path: 'friends',
        select: ['name', 'lastName', 'photo'],
      })
      .populate({
        path: 'friendRequests',
        select: ['name', 'lastName', 'photo'],
      });

    if (!targetUser) {
      res.status(404).json({ message: 'User not found' });
      return next();
    }

    if (req.body.currentUser.id !== targetUser.id) {
      isFriendRequested = targetUser.friendRequests.some(
        (friend) => friend.id === req.body.currentUser.id
      );

      isAlreadyFriends = targetUser.friends.some(
        (friend) => friend.id === req.body.currentUser.id
      );

      res.status(200).json({
        status: 'success',
        data: {
          isAlreadyFriends: isAlreadyFriends,
          isFriendRequested: isFriendRequested,
          targetUser,
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        targetUser,
      },
    });
  }
);

const addFriend = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userToAdd = await User.findById(req.body.id);
    const currentUser = await User.findById(req.body.currentUser.id);

    if (!userToAdd || !currentUser) {
      res.status(404).json({ error: 'This user does not exist' });
      return next();
    }

    if (userToAdd.id === currentUser.id) {
      res.status(404).json({ error: 'You cannot add yourself as a friend' });
      return next();
    }

    if (
      userToAdd.friendRequests.includes(currentUser.id) ||
      currentUser.friendRequests.includes(userToAdd.id)
    ) {
      res.status(400).json({ error: 'Already requested' });
      return next();
    }

    if (
      userToAdd.friends.includes(currentUser.id) ||
      currentUser.friends.includes(userToAdd.id)
    ) {
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

const acceptFriendRequest = catchAsync(
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

const denyFriendRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestedUser = await User.findById(req.body.id);
    const currentUser = await User.findById(req.body.currentUser.id);

    if (!requestedUser || !currentUser) {
      res.status(400).json({ error: 'This user does not exist' });
      return next();
    }

    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== requestedUser.id
    );

    console.log(currentUser);

    await currentUser.save({ validateBeforeSave: false });

    res.status(204).json({
      status: 'sucess',
      data: null,
    });
  }
);

export default {
  getAllUsers,
  createUser,
  addFriend,
  acceptFriendRequest,
  getOneUser,
  denyFriendRequest,
};
