import type { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookies.js';

export async function register(req: Request, res: Response) {
  const user = await authService.register(req.body);
  setAuthCookies(res, user.id);
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const user = await authService.login(req.body);
  setAuthCookies(res, user.id);
  res.status(201).json({ user });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken as string | undefined;
  const user = await authService.authByRefreshToken(token)
  setAuthCookies(res, user.id);
  res.json({ user })
}

export async function logout(_req: Request, res: Response) {
  clearAuthCookies(res)
  res.status(204).end();
}

export async function me(req: Request, res: Response) {
  res.json({ user: req.user });
}
