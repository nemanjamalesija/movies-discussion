import mongoose, { Document } from 'mongoose';

export type UserType = Document & {
  name: string;
  lastName: string;
  email: string;
  photo: string;
  role: string;
  password: string;
  passwordConfirm: string | undefined;
  joinedAt: Date;
  active: boolean;
  friends: mongoose.Schema.Types.ObjectId[];
  friendRequests: mongoose.Schema.Types.ObjectId[];
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  createPasswordResetToken: () => string;
  changedPasswordAfter: (jwtTimestamp: number) => boolean;
};
