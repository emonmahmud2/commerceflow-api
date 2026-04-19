import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/AppError.js";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: "Invalid id",
      path: err.path,
    });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(422).json({
      success: false,
      message: "Validation failed",
      details: err.errors,
    });
    return;
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
}
