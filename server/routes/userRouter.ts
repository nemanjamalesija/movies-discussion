import express from 'express';
import userController from '../controllers/userController.ts';
import postRouter from './postRouter.ts';
import authController from '../controllers/authController.ts';

const router = express.Router();
router.use('/:userId/posts', postRouter);

// AUTH
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/getUserWithToken', authController.getUserWithToken);
router.get('/logout', authController.logout);

router.use(authController.protect);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.post('/:id', userController.addFriend);

export default router;
