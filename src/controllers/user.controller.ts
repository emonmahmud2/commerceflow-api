import type { Request, Response } from "express";
import * as userService from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getMe(req.authUser!.id);
  res.json({ success: true, data: user });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateMe(req.authUser!.id, req.body);
  res.json({ success: true, data: user });
});
