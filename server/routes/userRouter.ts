import express from 'express';
import userController from '../controllers/userController.ts';
import postRouter from './postRouter.ts';

const router = express.Router();
router.use('/:userId/posts', postRouter);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

export default router;
