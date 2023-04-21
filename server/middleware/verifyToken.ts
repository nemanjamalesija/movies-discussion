import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.header('Authorization');

    if (!token) return res.status(403).send('Access denied');

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimStart();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof verified === 'string')
      throw new Error('Authentication token is not valid');

    res.locals.token = verified;

    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default verifyToken;
