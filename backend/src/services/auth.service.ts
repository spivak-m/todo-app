import bcrypt from 'bcrypt';

import * as userRepository from '../repositories/user.repository.js';
import { HttpError } from '../utils/HttpError';
import type { PublicUser, RegisterInput, LoginInput } from 'shared';
import { verifyAccess, verifyRefresh } from './token.service.js';

const BCRYPT_ROUNDS = 10;

export async function register(input: RegisterInput): Promise<PublicUser> {
  const existingUser = await userRepository.findByEmail(input.email);
  if (existingUser) throw new HttpError(409, 'Email already in use');
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const newUser = await userRepository.create(input.email, passwordHash);
  return { id: newUser.id, email: newUser.email };
}

export async function login(input: LoginInput): Promise<PublicUser> {
  const user = await userRepository.findByEmail(input.email);
  if (!user) throw new HttpError(401, 'Invalid email or password');
  const isMatch = await bcrypt.compare(input.password, user.password_hash);
  if (!isMatch) throw new HttpError(401, 'Invalid email or password');
  return { id: user.id, email: user.email };
}

export async function authByAccessToken(token: string | undefined): Promise<PublicUser> {
  if(!token) throw new HttpError(401, 'No auth token');
  const payload = verifyAccess(token);
  const user = await userRepository.findById(payload.userId);
  if(!user) throw new HttpError(401, 'User not found');
  return { id: user.id, email: user.email };
}

export async function authByRefreshToken(token: string | undefined): Promise<PublicUser> {
  if(!token) throw new HttpError(401, 'No refresh token');
  const payload = verifyRefresh(token);
  const user = await userRepository.findById(payload.userId);
  if(!user) throw new HttpError(401, 'User not found');
  return { id: user.id, email: user.email };
}
