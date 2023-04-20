import express from 'express';
import loginControler from '../controllers/loginControler.ts';

const router = express.Router();

router.route('/login').post(loginControler);

export default router;
