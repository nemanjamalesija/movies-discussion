import catchAsync from '../helpers/catchAsync.ts';
import Post from '../models/Post.ts';
import User from '../models/User.ts';
import controllerFactory from './controllerFactory.ts';
import { Request, Response, NextFunction } from 'express';

const getAllPosts = controllerFactory.getAll(Post);
const deletePost = controllerFactory.deleteOne(Post);
const updatePost = controllerFactory.updateOne(Post);

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
};
