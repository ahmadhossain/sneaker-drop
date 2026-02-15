import { Request, Response, NextFunction } from 'express';
import { User } from '../models';

export async function validateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ error: 'userId is required' });
    return;
  }

  const user = await User.findByPk(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  next();
}
