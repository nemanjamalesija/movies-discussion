import Post from '../models/Post.ts';
import User from '../models/User.ts';
import { AppError } from '../helpers/appError.ts';

async function getUsersFeed(userId: string, offset: number, limit: number) {
  if (offset < 0 || limit < 0 || Number.isNaN(offset) || Number.isNaN(limit))
    throw new AppError('Must provide offset and limit in query string', 400);

  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const posts = await Post.find()
    .populate({
      path: 'author',
      select: ['-password', '-passwordConfirm'],
    })
    .populate({
      path: 'likes',
      select: ['name', 'lastName', 'photo'],
    })
    .populate({
      path: 'comments',
      select: ['text', 'author'],
      populate: {
        path: 'author',
        select: ['name', 'lastName', 'photo'],
      },
    })
    .where('author')
    .in([...user.friends, user.id])
    .sort({ createdAt: 'desc' })
    .skip(offset)
    .limit(limit);

  return posts;
}

export default { getUsersFeed };
