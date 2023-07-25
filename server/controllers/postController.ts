import { AppError } from '../helpers/appError.ts';
import catchAsync from '../helpers/catchAsync.ts';
import Post from '../models/Post.ts';
import postServices from '../services/postServices.ts';
import controllerFactory from './controllerFactory.ts';
import { Request, Response, NextFunction } from 'express';

const getAllPosts = controllerFactory.getAll(Post);
const deletePost = controllerFactory.deleteOne(Post);
const updatePost = controllerFactory.updateOne(Post);

const getUsersFeed = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.body.currentUser.id;
  const { offset, limit } = req.query;

  const posts = await postServices.getUsersFeed(
    currentUserId,
    parseInt(offset as string),
    parseInt(limit as string)
  );

  res.status(200).json({
    message: 'success',
    data: { posts },
  });
});

const createPost = catchAsync(async (req: Request, res: Response) => {
  const { text, photo } = req.body;

  const newPost = await postServices.createPost(
    req.body.currentUser.id,
    text,
    photo
  );

  res.status(200).json({
    message: 'sucess',
    data: { newPost },
  });
});

const likePost = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.body.currentUser.id;
  const targetPostId = req.body.id;

  const targetPost = await postServices.likePost(currentUserId, targetPostId);

  res.status(200).json({ message: 'succeess', data: { targetPost } });
});

const unlikePost = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.body.currentUser.id;
  const targetPostId = req.body.id;

  const targetPost = await postServices.unlikePost(currentUserId, targetPostId);
  res.status(200).json({ message: 'success', data: { targetPost } });
});

export default {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  likePost,
  unlikePost,
  getUsersFeed,
};
