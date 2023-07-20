import { Types, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserType } from '../types/User.ts';

const userSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: [true, 'User must have a name'],
    },

    lastName: {
      type: String,
      required: [true, 'User must have a last name'],
    },

    email: {
      type: String,
      required: [true, 'User must have an email'],
      unique: true,
      lowercase: true,
    },

    photo: {
      type: String,
      default: () => {
        return '';
      },
    },

    friends: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],

    friendRequests: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    password: {
      type: String,
      required: [true, 'User must have a password'],
      minlength: 1,
      select: false,
    },

    passwordConfirm: {
      type: String || undefined,
      required: [true, 'You must confirm the password'],
    },

    joinedAt: {
      type: Date,
      default: () => {
        return Date.now();
      },
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'author',
  localField: '_id',
});

userSchema.pre(/^find/, function (next) {
  this.populate('posts');

  next();
});

// HASH PASSWORD ON SIGNUP
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password as string, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// PASS VERIFICATION
userSchema.methods.correctPassword = async function (
  canditatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(canditatePassword, userPassword);
};

const User = model<UserType>('User', userSchema);

export default User;
