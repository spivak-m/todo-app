import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';

export interface JwtPayload {
  userId: number;
}

export function signAccess(userId: number): string {
  return jwt.sign({ userId }, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signRefresh(userId: number): string {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyAccess(token: string): JwtPayload {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  } catch (err) {
    throw new HttpError(401, 'Invalid access token');
  }
}

export function verifyRefresh(token: string): JwtPayload {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch (err) {
    throw new HttpError(401, 'Invalid refresh token');
  }
}
