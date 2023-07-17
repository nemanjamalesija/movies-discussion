import mongoose from 'mongoose';

const postScehma = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a Tour!'],
  },

  text: {
    type: Number,
    require: [true, 'Booking must have a price.'],
  },
  createdAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
});

postScehma.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'user',
    select: 'name lastName',
  });
  next();
});
