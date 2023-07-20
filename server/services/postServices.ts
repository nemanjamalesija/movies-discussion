import Post from '../models/Post.ts';
import User from '../models/User.ts';

async function getUsersFeed(userId: string, offset: number, limit: number) {
  if (offset < 0 || limit < 0 || Number.isNaN(offset) || Number.isNaN(limit))
    throw new Error('Must provide offset and limit in the query string');

  const user = await User.findById(userId);
  if (!user) return null;

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
