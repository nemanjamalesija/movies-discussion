import { Request, Response, NextFunction } from 'express';
import catchAsync from '../helpers/catchAsync.ts';
import User from '../models/User.ts';
import controllerFactory from './controllerFactory.ts';

const getAllUsers = controllerFactory.getAll(User);
const createUser = controllerFactory.createOne(User);

const getOneUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
      res.status(404).json({ error: 'User not found' });
      return next();
    }

    if (req.body.currentUser.id !== targetUser.id) {
      const isFriendRequested = targetUser.friendRequests.some(
        (friend) => friend.id === req.body.currentUser.id
      );

      const isAlreadyFriends = targetUser.friends.some(
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
    const currentUserId = req.body.currentUser.id;
    const targetUserId = req.body.id;

    const [currentUser, targetUser] = await User.find({
      _id: { $in: [currentUserId, targetUserId] },
    });

    if (!targetUser || !currentUser) {
      res.status(404).json({ error: 'This user does not exist' });
      return next();
    }

    if (targetUser.id === currentUser.id) {
      res.status(400).json({ error: 'You cannot add yourself as a friend' });
      return next();
    }

    if (
      targetUser.friendRequests.includes(currentUser.id) ||
      currentUser.friendRequests.includes(targetUser.id)
    ) {
      res.status(400).json({ error: 'Already requested' });
      return next();
    }

    if (
      targetUser.friends.includes(currentUser.id) ||
      currentUser.friends.includes(targetUser.id)
    ) {
      res
        .status(400)
        .json({ error: 'This person is already in your friends list.' });
      return next();
    }

    targetUser.friendRequests = [...targetUser.friendRequests, currentUser.id];

    await targetUser.save({ validateBeforeSave: false });
    res.status(200).json({
      status: 'success',
      message: 'Request sucessfully sent',
    });
  }
);

const acceptFriendRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.body.currentUser.id;
    const targetUserId = req.body.id;

    const [currentUser, targetUser] = await User.find({
      _id: { $in: [currentUserId, targetUserId] },
    });

    if (!targetUser || !currentUser) {
      res.status(400).json({ error: 'This user does not exist' });
      return next();
    }

    if (
      targetUser.friends.includes(currentUser.id) ||
      currentUser.friends.includes(targetUser.id)
    ) {
      res.status(400).json({ error: 'You are already friend with this user.' });
      return next();
    }

    currentUser.friends.push(targetUser.id);
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== targetUser.id
    );

    targetUser.friends.push(currentUser.id);

    await currentUser.save({ validateBeforeSave: false });
    await targetUser.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'User accepted to your friend list!',
    });
  }
);

const denyFriendRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = await User.findById(req.body.currentUser.id);
    const targetUser = await User.findById(req.body.id);

    if (!targetUser || !currentUser) {
      res.status(400).json({ error: 'This user does not exist' });
      return next();
    }

    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== targetUser.id
    );

    await currentUser.save({ validateBeforeSave: false });

    res.status(204).json({
      status: 'sucess',
      data: null,
    });
  }
);

const removeFriend = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.body.currentUser.id;
    const targetUserId = req.body.id;

    const [currentUser, targetUser] = await User.find({
      _id: { $in: [currentUserId, targetUserId] },
    });

    if (!targetUser || !currentUser) {
      res.status(400).json({ error: 'This user does not exist' });
      return next();
    }

    currentUser.friends = currentUser.friends.filter(
      (id) => id.toString() !== targetUser.id
    );
    targetUser.friends = targetUser.friends.filter(
      (id) => id.toString() !== currentUser.id
    );

    await currentUser.save({ validateBeforeSave: false });
    await targetUser.save({ validateBeforeSave: false });

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
  removeFriend,
};
