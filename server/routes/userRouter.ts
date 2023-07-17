import express from 'express';
import userController from '../controllers/userController.ts';

const router = express.Router();

router.get('/', userController.getAllUsers);

export default router;
