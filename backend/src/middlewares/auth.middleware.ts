import type { Request, Response, NextFunction } from 'express';
import { authByAccessToken } from '../services/auth.service.js';
import { asyncHandler } from './asyncHandler.js';

export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;
  const user = await authByAccessToken(token)
  req.user = { id: user.id, email: user.email };
  next();
})
