import express from 'express';
import postController from '../controllers/postController.ts';
import authController from '../controllers/authController.ts';

const router = express.Router();

router.use(authController.protect);

router.get('/feed', postController.getUsersFeed);

router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost);

router.patch('/like', postController.likePost);
router.patch('/unlike', postController.unlikePost);

router
  .route('/:id')
  .delete(postController.deletePost)
  .patch(postController.updatePost);

export default router;
