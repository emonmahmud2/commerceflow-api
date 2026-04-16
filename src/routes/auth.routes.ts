import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
} from "../validators/auth.validator.js";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  validateBody(registerSchema),
  authController.register
);
authRoutes.post("/login", validateBody(loginSchema), authController.login);
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
