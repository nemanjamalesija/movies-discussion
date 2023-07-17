import { NextFunction, Request, Response } from 'express';
import User from '../models/User.ts';

async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'sucess',
    length: users.length,
    data: { users },
  });
}

export default { getAllUsers };
