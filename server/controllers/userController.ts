import { Request, Response } from 'express';
import catchAsync from '../helpers/catchAsync.ts';
import User from '../models/User.ts';
import controllerFactory from './controllerFactory.ts';
import userServices from '../services/userServices.ts';

const getAllUsers = controllerFactory.getAll(User);
const createUser = controllerFactory.createOne(User);

const getOneUser = catchAsync(async (req: Request, res: Response) => {
  const targetUser = await userServices.getOneUser(req.params.id);

  if (req.body.currentUser.id !== targetUser._id) {
    const isFriendRequested = targetUser.friendRequests.some(
      (requestId) => requestId.toString() === req.body.currentUser.id
    );

    const isAlreadyFriends = targetUser.friends.some(
      (friend) => friend._id.toString() === req.body.currentUser.id
    );

    res.status(200).json({
      status: 'success',
      data: {
        isAlreadyFriends: isAlreadyFriends,
        isFriendRequested: isFriendRequested,
        targetUser,
      },
    });
  } else
    res.status(200).json({
      status: 'success',
      data: {
        targetUser,
      },
    });
});

async function getSearched(req: Request, res: Response) {
  const { firstName, lastName, limit } = req.query;

  const users = await userServices.getSearched(
    firstName as string,
    lastName as string,
    parseInt(limit as string)
  );

  res.status(200).json({
    message: 'sucess',
    data: { users },
  });
}

const addFriend = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.body.currentUser.id;
  const targetUserId = req.body.id;

  await userServices.addFriend(currentUserId, targetUserId);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

const acceptFriendRequest = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.body.currentUser.id;
  const targetUserId = req.body.id;

  const targetUser = await userServices.acceptFriendRequest(
    currentUserId,
    targetUserId
  );

  res.status(200).json({
    status: 'success',
    data: { targetUser },
  });
});

const denyFriendRequest = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.body.currentUser.id;
  const targetUserId = req.body.id;

  await userServices.dennyFriendRequest(currentUserId, targetUserId);

  res.status(204).json({
    status: 'success',
    data: { sir: 'blir' },
  });
});

const removeFriend = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.body.currentUser.id;
  const targetUserId = req.body.id;

  const targetUser = await userServices.removeFriend(
    currentUserId,
    targetUserId
  );

  res.status(200).json({
    status: 'success',
    data: { targetUser },
  });
});

export default {
  getAllUsers,
  createUser,
  getSearched,
  addFriend,
  acceptFriendRequest,
  getOneUser,
  denyFriendRequest,
  removeFriend,
};
