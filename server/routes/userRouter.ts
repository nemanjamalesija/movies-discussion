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
  .post(userController.createUser)
  .patch(userController.acceptFriendRequest);

router.get('/getSearched', userController.getSearched);

router.get('/:id', userController.getOneUser);

/* USER FRIENDS RELATED */
router.patch('/add', userController.addFriend);
router.patch('/accept', userController.acceptFriendRequest);
router.delete('/denny', userController.denyFriendRequest);
router.delete('/remove', userController.removeFriend);

export default router;
