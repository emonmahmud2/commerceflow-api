import type { Request, Response } from "express";
import * as productService from "../services/product.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const data = await productService.listProducts();
  res.json({ success: true, data });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const data = await productService.getProduct(req.params.id);
  res.json({ success: true, data });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = await productService.createProduct(req.body);
  res.status(201).json({ success: true, data });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = await productService.updateProduct(req.params.id, req.body);
  res.json({ success: true, data });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const data = await productService.deleteProduct(req.params.id);
  res.json({ success: true, data });
});
