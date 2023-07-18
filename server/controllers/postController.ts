import Post from '../models/Post.ts';
import controllerFactory from './controllerFactory.ts';

const getAllPosts = controllerFactory.getAll(Post);
const createPost = controllerFactory.createOne(Post);

export default { getAllPosts, createPost };
