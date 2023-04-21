import express from 'express';

import verifyToken from '../middleware/verifyToken.ts';
import {
  getUserController,
  gerUserFriendsController,
} from '../controllers/usersController.ts';

const router = express.Router();

router.route('/:id').get(verifyToken, getUserController);
router.route('/:id/friends').get(verifyToken, gerUserFriendsController);

export default router;
