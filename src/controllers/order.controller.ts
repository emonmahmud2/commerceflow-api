import type { Request, Response } from "express";
import * as orderService from "../services/order.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const user = req.authUser!;
  const data = await orderService.createOrder(user.id, req.body.items);
  res.status(201).json({ success: true, data });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const user = req.authUser!;
  const data = await orderService.listOrders(user.id, user.role);
  res.json({ success: true, data });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const user = req.authUser!;
  const data = await orderService.getOrder(
    req.params.id,
    user.id,
    user.role
  );
  res.json({ success: true, data });
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const data = await orderService.updateOrderStatus(
    req.params.id,
    req.body.status
  );
  res.json({ success: true, data });
});

export const cancel = asyncHandler(async (req: Request, res: Response) => {
  const user = req.authUser!;
  const data = await orderService.cancelOrder(
    req.params.id,
    user.id,
    user.role
  );
  res.json({ success: true, data });
});
