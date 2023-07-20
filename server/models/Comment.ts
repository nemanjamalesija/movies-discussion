import { model, Schema } from 'mongoose';
import { CommentType } from '../types/Comment.ts';

const commentSchema = new Schema<CommentType>(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model<CommentType>('Comment', commentSchema);

export default Comment;
