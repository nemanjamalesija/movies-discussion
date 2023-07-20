import express from 'express';
import authController from '../controllers/authController.ts';
import commentController from '../controllers/commentController.ts';

const router = express.Router();

router.use(authController.protect);

/* COMMENTS */
router.route('/:postId').post(commentController.createComment);

export default router;
