import express from 'express';
import postController from '../controllers/postController.ts';
import authController from '../controllers/authController.ts';

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost);

export default router;
