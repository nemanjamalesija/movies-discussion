import catchAsync from '../helpers/catchAsync.ts';
import { Request, Response } from 'express';
import Comment from '../models/Comment.ts';
import controllerFactory from './controllerFactory.ts';
import commentServices from '../services/commentServices.ts';

const createComment = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.body.currentUser.id;
  const targetPostId = req.params.id;
  const newCommentText = req.body.text;

  const newComment = await commentServices.createComment(
    currentUserId,
    targetPostId,
    newCommentText
  );

  res.status(200).json({
    message: 'success',
    data: { newComment },
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const targetcommentId = req.params.id;

  await commentServices.deleteComment(targetcommentId);

  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});
const editComment = controllerFactory.updateOne(Comment);

export default { createComment, deleteComment, editComment };
