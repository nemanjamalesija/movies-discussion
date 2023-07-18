import express from 'express';
import userController from '../controllers/userController.ts';

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

export default router;
