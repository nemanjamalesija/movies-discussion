import { Types } from 'mongoose';

export type PostType = {
  text: string;
  image: string;
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
};
