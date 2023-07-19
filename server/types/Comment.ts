import { Types } from 'mongoose';

export type CommentType = {
  text: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
};
