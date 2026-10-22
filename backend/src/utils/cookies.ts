import type { Response } from 'express';
import { env } from '../config/env.js';
import{ signAccess, signRefresh } from '../services/token.service.js';

const COOKIE_BASE = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export function setAuthCookies(res: Response, userId: number) {
  const accessToken = signAccess(userId);
  const refreshToken = signRefresh(userId);

  res.cookie('accessToken', accessToken, { ...COOKIE_BASE, maxAge: 15 * 60 * 1000 }); // 15 minutes
  res.cookie('refreshToken', refreshToken, { ...COOKIE_BASE, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api/auth/refresh' }); // 7 days
}

export function clearAuthCookies(res: Response) {
  res.clearCookie('accessToken', { ...COOKIE_BASE, maxAge: 0 });
  res.clearCookie('refreshToken', { ...COOKIE_BASE, maxAge: 0, path: '/api/auth/refresh' });
}
