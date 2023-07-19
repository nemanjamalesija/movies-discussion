import { Schema, model } from 'mongoose';
import { PostType } from '../types/Post.ts';

const postSchema = new Schema<PostType>(
  {
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
  },
  {
    timestamps: true,
  }
);

postSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'user',
    select: 'name lastName',
  });
  next();
});

const Post = model<PostType>('Post', postSchema);

export default Post;
