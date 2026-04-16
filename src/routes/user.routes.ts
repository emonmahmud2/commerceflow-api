import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { updateMeSchema } from "../validators/user.validator.js";

export const userRoutes = Router();

userRoutes.get("/me", authMiddleware, userController.getMe);
userRoutes.patch(
  "/me",
  authMiddleware,
  validateBody(updateMeSchema),
  userController.updateMe
);
