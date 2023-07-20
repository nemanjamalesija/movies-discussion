import catchAsync from '../helpers/catchAsync.ts';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User.ts';
import Post from '../models/Post.ts';
import Comment from '../models/Comment.ts';

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.body.currentUser.id;
    const targetPostId = req.params.postId;
    const newCommentText = req.body.text;

    const currentUser = await User.findById(currentUserId);
    const targetPost = await Post.findById(targetPostId);

    if (!currentUser) {
      res.status(400).json({ error: 'This user does not exist' });
      return next();
    }

    if (!targetPost) {
      res.status(400).json({ error: 'This post does not exist' });
      return next();
    }

    const newComment = await Comment.create({
      text: newCommentText,
      author: currentUserId,
      post: targetPostId,
    });

    targetPost.comments.push(newComment.id);

    await targetPost.save();

    res.status(200).json({
      message: 'success',
      data: { newComment },
    });
  }
);

export default { createComment };
