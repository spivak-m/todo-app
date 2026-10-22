import { Router } from "express";
import * as authController from '../controllers/auth.controller.js'
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { registerSchema, loginSchema } from "shared";

const router = Router();

router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(authController.register),
);

router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(authController.login),
);

router.post(
  '/refresh',
  asyncHandler(authController.refresh)
);

router.post(
  '/logout',
  asyncHandler(authController.logout)
);

router.post(
  '/me',
  requireAuth,
  asyncHandler(authController.me)
);

export default router;
