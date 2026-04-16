import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/role.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { ROLES } from "../constants/roles.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";

export const productRoutes = Router();

productRoutes.get("/", productController.list);
productRoutes.get("/:id", productController.getOne);

productRoutes.post(
  "/",
  authMiddleware,
  requireRoles(ROLES.ADMIN),
  validateBody(createProductSchema),
  productController.create
);

productRoutes.patch(
  "/:id",
  authMiddleware,
  requireRoles(ROLES.ADMIN),
  validateBody(updateProductSchema),
  productController.update
);

productRoutes.delete(
  "/:id",
  authMiddleware,
  requireRoles(ROLES.ADMIN),
  productController.remove
);
