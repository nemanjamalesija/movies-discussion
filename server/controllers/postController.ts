import { NextFunction, Request, Response } from 'express';
import User from '../models/User.ts';
import Post from '../models/Post.ts';

async function getAllPosts(req: Request, res: Response, next: NextFunction) {
  const posts = await Post.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'sucess',
    length: posts.length,
    data: { posts },
  });
}

export default { getAllPosts };
