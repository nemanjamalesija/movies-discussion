import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must belong to an User!'],
  },

  text: {
    type: Number,
    required: [true, 'Post must have some text!'],
  },
  createdAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
});

postSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'user',
    select: 'name lastName',
  });
  next();
});
