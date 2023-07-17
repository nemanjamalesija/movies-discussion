import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requred: [true, 'User must have a name'],
  },

  lastName: {
    type: String,
    requred: [true, 'User must have a name'],
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
      return 'https://jumbo-bowls.onrender.com/public/images/users/defaultUser.webp';
    },
  },

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
});

const User = mongoose.model('User', userSchema);

export default User;
