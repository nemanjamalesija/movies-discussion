import catchAsync from '../helpers/catchAsync.ts';
import Post from '../models/Post.ts';
import User from '../models/User.ts';
import controllerFactory from './controllerFactory.ts';
import { Request, Response, NextFunction } from 'express';

const getAllPosts = controllerFactory.getAll(Post);
const deletePost = controllerFactory.deleteOne(Post);
const updatePost = controllerFactory.updateOne(Post);

async function getFeed(userId: string, offset: number, limit: number) {
  if (offset < 0 || limit < 0 || Number.isNaN(offset) || Number.isNaN(limit))
    throw new Error('Must provide offset and limit in the query string');

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const posts = await Post.find()
    .populate({
      path: 'author',
      select: ['-password', '-passwordConfirm'],
    })
    .populate({
      path: 'likes',
      select: ['name', 'lastName', 'photo'],
    })
    .populate({
      path: 'comments',
      select: ['text', 'author'],
      populate: {
        path: 'author',
        select: ['name', 'lastName', 'photo'],
      },
    })
    .where('author')
    .in([...user.friends, user.id])
    .sort({ createdAt: 'desc' })
    .skip(offset)
    .limit(limit);

  return posts;
}

const getUsersFeed = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.body.currentUser.id;
    const { offset, limit } = req.query;

    const posts = await getFeed(
      currentUserId,
      parseInt(offset as string),
      parseInt(limit as string)
    );

    res.json(posts);
  }
);

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = await User.findById(req.body.currentUser.id);

    if (!currentUser) {
      res.status(404).json({ message: 'User not found' });
      return next();
    }

    const { text, photo } = req.body;

    const post = await Post.create({ text, photo, author: currentUser.id });
    await post.save();

    res.status(200).json({
      message: 'sucess',
      data: { post },
    });
  }
);

const like = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = await User.findById(req.body.currentUser.id);
    const currentPost = await Post.findById(req.body.id);

    if (!currentUser) {
      res.status(404).json({ error: 'User not found' });
      return next();
    }

    if (!currentPost) {
      res.status(404).json({ error: 'Post not found' });
      return next();
    }

    const isAlreadyLiked = currentPost.likes.some(
      (id) => id.toString() === currentUser.id
    );

    if (isAlreadyLiked) {
      res.status(400).json({ error: 'Already liked this post' });
      return next();
    }

    currentPost.likes.push(currentUser.id);
    await currentPost.save();

    res.status(200).json({ message: 'succeess' });
  }
);

const unlike = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = await User.findById(req.body.currentUser.id);
    const currentPost = await Post.findById(req.body.id);

    if (!currentUser) {
      res.status(404).json({ error: 'User not found' });
      return next();
    }

    if (!currentPost) {
      res.status(404).json({ error: 'Post not found' });
      return next();
    }

    const isAlreadyLiked = currentPost.likes.some(
      (id) => id.toString() === currentUser.id
    );

    if (!isAlreadyLiked) {
      res.status(400).json({ error: 'First you must like this post' });
      return next();
    }

    currentPost.likes = currentPost.likes.filter(
      (id) => id.toString() !== currentUser.id
    );

    await currentPost.save();

    res.status(200).json({ message: 'success' });
  }
);

export default {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  like,
  unlike,
  getUsersFeed,
};
