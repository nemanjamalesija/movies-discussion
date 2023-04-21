import User from '../models/User.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const loginControler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // user does not exist
  if (!user) return res.status(400).json({ message: 'User does not exist' });

  // does password match
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(400).json, { message: 'Invalid credentials' };

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);

  res.status(200).json({
    token,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
  try {
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default loginControler;
