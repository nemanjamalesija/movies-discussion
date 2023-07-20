import express from 'express';
import postController from '../controllers/postController.ts';
import authController from '../controllers/authController.ts';

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost);

router
  .route('/:id')
  .delete(postController.deletePost)
  .patch(postController.updatePost);

export default router;
