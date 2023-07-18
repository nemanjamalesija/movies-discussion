import express from 'express';
import postController from '../controllers/postController.ts';

const router = express.Router();

router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost);

export default router;
