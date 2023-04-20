import express from 'express';
import { login } from '../controllers/login.ts';

const router = express.Router();

router.post('/login', login);

export default router;
