import { Schema, model } from 'mongoose';
import { PostType } from '../types/Post.ts';

const postSchema = new Schema<PostType>({
  text: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  createdAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
});

const Post = model<PostType>('Post', postSchema);

export default Post;
