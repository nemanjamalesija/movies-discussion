import { AppError } from '../helpers/appError.ts';
import Comment from '../models/Comment.ts';
import Post from '../models/Post.ts';
import User from '../models/User.ts';

async function createComment(
  currentUserId: string,
  targetPostId: string,
  newCommentText: string
) {
  const currentUser = await User.findById(currentUserId);
  const targetPost = await Post.findById(targetPostId);

  if (!currentUser) {
    throw new AppError('User not found', 404);
  }

  if (!targetPost) {
    throw new AppError('Post not found', 404);
  }

  const newComment = await Comment.create({
    text: newCommentText,
    author: currentUserId,
    post: targetPostId,
  });

  targetPost.comments.push(newComment.id);

  await targetPost.save();

  return newComment;
}

async function deleteComment(targetPostId: string) {
  const targetcomment = await Comment.findById(targetPostId);

  if (!targetcomment) {
    throw new AppError('Comment not found', 404);
  }

  const targetPost = await Post.findById(targetcomment.post);

  if (!targetPost) {
    throw new AppError('Post not found', 404);
  }

  targetPost.comments = targetPost.comments.filter(
    (id) => id.toString() !== targetcomment.id
  );

  await targetPost.save();
  await Comment.findByIdAndUpdate(targetcomment.id);
}

export default { createComment, deleteComment };
