import { AppError } from '../helpers/appError.ts';
import User from '../models/User.ts';

async function getOneUser(targetUserId: string) {
  const targetUser = await User.findById(targetUserId)
    .populate({
      path: 'posts',
      strictPopulate: false,
      populate: {
        path: 'author',
        select: ['firstName', 'lastName', 'photo'],
      },
    })
    .populate({
      path: 'posts',
      strictPopulate: false,
      populate: {
        path: 'likes',
        select: ['firstName', 'lastName', 'photo'],
      },
    })
    .populate({
      path: 'posts',
      strictPopulate: false,
      populate: {
        path: 'comments',
        select: ['text', 'author'],

        populate: {
          path: 'author',
          select: ['firstName', 'lastName', 'photo'],
        },
      },
    })
    .populate({
      path: 'friends',
      select: ['firstName', 'lastName', 'photo'],
    });

  if (!targetUser) {
    throw new AppError('User not found', 404);
  }

  return targetUser;
}

async function getSearched(firstName: string, lastName: string, limit: number) {
  if (limit < 0 || Number.isNaN(limit))
    throw new AppError('Must provide limit in query string', 400);

  const users = await User.find({
    $and: [{ firstName: { $regex: new RegExp(firstName, 'i') } }],
    lastName: { $regex: new RegExp(lastName, 'i') },
  })
    .select(['firstName', 'lastName', 'photo'])
    .limit(limit)
    .sort({
      firstName: 'asc',
      lastName: 'asc',
    });

  return users;
}

async function addFriend(currentUserId: string, targetUserId: string) {
  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser || !currentUser) {
    throw new AppError('User not found', 404);
  }

  if (targetUser.id === currentUser.id) {
    throw new AppError('You cannot add yourself as a friend', 400);
  }

  if (
    targetUser.friendRequests.includes(currentUser.id) ||
    currentUser.friendRequests.includes(targetUser.id)
  ) {
    throw new AppError('Already requested this friend', 400);
  }

  if (
    targetUser.friends.includes(currentUser.id) ||
    currentUser.friends.includes(targetUser.id)
  ) {
    throw new AppError('This person is already in your friends list', 400);
  }

  targetUser.friendRequests = [...targetUser.friendRequests, currentUser.id];

  await targetUser.save({ validateBeforeSave: false });
}

async function acceptFriendRequest(
  currentUserId: string,
  targetUserId: string
) {
  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser || !currentUser) {
    throw new AppError('User not found', 404);
  }

  if (
    targetUser.friends.includes(currentUser.id) ||
    currentUser.friends.includes(targetUser.id)
  ) {
    throw new AppError('This person is already in your friends list', 400);
  }

  currentUser.friends.push(targetUser.id);
  currentUser.friendRequests = currentUser.friendRequests.filter(
    (id) => id.toString() !== targetUser.id
  );

  targetUser.friends.push(currentUser.id);

  await currentUser.save({ validateBeforeSave: false });
  await targetUser.save({ validateBeforeSave: false });

  return targetUser;
}

async function dennyFriendRequest(currentUserId: string, targetUserId: string) {
  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser || !currentUser) {
    throw new AppError('User not found', 404);
  }

  currentUser.friendRequests = currentUser.friendRequests.filter(
    (id) => id.toString() !== targetUser.id
  );

  await currentUser.save({ validateBeforeSave: false });
}

async function removeFriend(currentUserId: string, targetUserId: string) {
  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser || !currentUser) {
    throw new AppError('User not found', 404);
  }

  currentUser.friends = currentUser.friends.filter(
    (id) => id.toString() !== targetUser.id
  );
  targetUser.friends = targetUser.friends.filter(
    (id) => id.toString() !== currentUser.id
  );

  await currentUser.save({ validateBeforeSave: false });
  await targetUser.save({ validateBeforeSave: false });

  return targetUser;
}

export default {
  getOneUser,
  getSearched,
  addFriend,
  acceptFriendRequest,
  dennyFriendRequest,
  removeFriend,
};
