import catchAsync from '../helpers/catchAsync.ts';
import Post from '../models/Post.ts';
import User from '../models/User.ts';
import controllerFactory from './controllerFactory.ts';
import { Request, Response, NextFunction } from 'express';

const getAllPosts = controllerFactory.getAll(Post);

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

export default { getAllPosts, createPost };
