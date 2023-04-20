import bcrypt from 'bcrypt';
import User from '../models/User.ts';
import { Request, Response } from 'express';

const registerController = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default registerController;
