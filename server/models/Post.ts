import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must belong to an User!'],
  },

  postText: {
    type: String,
    required: [true, 'Post must have some text!'],
  },

  likes: {
    type: Array,
  },

  comments: {
    type: Array,
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

const Post = mongoose.model('Post', postSchema);

export default Post;
