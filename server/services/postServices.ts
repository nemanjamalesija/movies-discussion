import Post from '../models/Post.ts';
import User from '../models/User.ts';
import { AppError } from '../helpers/appError.ts';

async function getUsersFeed(userId: string, offset: number, limit: number) {
  if (offset < 0 || limit < 0 || Number.isNaN(offset) || Number.isNaN(limit))
    throw new AppError(
      'Must provide offset and limit in the query string',
      400
    );

  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const posts = await Post.find()
    .populate({
      path: 'author',
      select: [
        '-password',
        '-passwordConfirm',
        '-email',
        '-role',
        '-active',
        '--v',
        '-friends',
      ],
    })
    .populate({
      path: 'likes',
      select: ['firstName', 'lastName', 'photo'],
    })
    .populate({
      path: 'comments',
      select: ['text', 'author'],
      populate: {
        path: 'author',
        select: ['firstName', 'lastName', 'photo'],
      },
    })
    .where('author')
    .in([...user.friends, user.id])
    .sort({ createdAt: 'desc' })
    .skip(offset)
    .limit(limit);

  return posts;
}

async function createPost(currentUserId: string, text: string, photo: string) {
  const currentUser = await User.findById(currentUserId);

  if (!currentUser) {
    throw new AppError('User not found', 404);
  }

  const post = await Post.create({ text, photo, author: currentUser.id });

  return post;
}

async function likePost(currentUserId: string, targetPostId: string) {
  const currentUser = await User.findById(currentUserId);
  const targetPost = await Post.findById(targetPostId);

  if (!currentUser) {
    throw new AppError('User not found', 404);
  }

  if (!targetPost) {
    throw new AppError('Post not found', 404);
  }

  const isAlreadyLiked = targetPost.likes.some(
    (id) => id.toString() === currentUser.id
  );

  if (isAlreadyLiked) {
    throw new AppError('Already liked this post', 401);
  }

  targetPost.likes.push(currentUser.id);
  await targetPost.save();

  return targetPost;
}

async function unlikePost(currentUserId: string, targetPostId: string) {
  const currentUser = await User.findById(currentUserId);
  const targetPost = await Post.findById(targetPostId);

  if (!currentUser) {
    throw new AppError('User not found', 404);
  }

  if (!targetPost) {
    throw new AppError('Post not found', 404);
  }

  const isAlreadyLiked = targetPost.likes.some(
    (id) => id.toString() === currentUser.id
  );

  if (!isAlreadyLiked) {
    throw new AppError('You must like the post first', 400);
  }

  targetPost.likes = targetPost.likes.filter(
    (id) => id.toString() !== currentUser.id
  );

  await targetPost.save();

  return targetPost;
}

export default { getUsersFeed, createPost, likePost, unlikePost };
