import { Request, Response } from 'express';
import User from '../models/User.ts';

export const getUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const gerUserFriendsController = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const friends = user.friends; // get the friends array from the user document
    res.status(200).json({ friends });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
