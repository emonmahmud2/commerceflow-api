import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import type { Role } from "../constants/roles.js";

export function requireRoles(...allowed: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.authUser;
    if (!user) {
      next(new AppError(401, "Unauthorized"));
      return;
    }
    if (!allowed.includes(user.role)) {
      next(new AppError(403, "Forbidden"));
      return;
    }
    next();
  };
}
