import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.register(req.body);
  res.status(201).json({ success: true, data });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.login(req.body);
  res.json({ success: true, data });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.refresh(req.body);
  res.json({ success: true, data });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req.body);
  res.json({ success: true, message: "Logged out" });
});
