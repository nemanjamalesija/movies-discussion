import { Document } from 'mongoose';

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
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  createPasswordResetToken: () => string;
  changedPasswordAfter: (jwtTimestamp: number) => boolean;
};
