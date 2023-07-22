import { Document, Types } from 'mongoose';

export type UserType = Document & {
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  role: string;
  password: string;
  passwordConfirm: string | undefined;
  joinedAt: Date;
  active: boolean;
  friends: Types.ObjectId[];
  friendRequests: Types.ObjectId[];
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  createPasswordResetToken: () => string;
  changedPasswordAfter: (jwtTimestamp: number) => boolean;
};
