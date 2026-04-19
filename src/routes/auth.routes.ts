import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import * as authController from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
} from "../validators/auth.validator.js";

export const authRoutes = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

authRoutes.post(
  "/register",
  authLimiter,
  validateBody(registerSchema),
  authController.register
);
authRoutes.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  authController.login
);
authRoutes.post(
  "/refresh",
  validateBody(refreshSchema),
  authController.refresh
);
authRoutes.post(
  "/logout",
  validateBody(logoutSchema),
  authController.logout
);
