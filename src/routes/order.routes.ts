import { Router } from "express";
import * as orderController from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/role.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { ROLES } from "../constants/roles.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/order.validator.js";

export const orderRoutes = Router();

orderRoutes.use(authMiddleware);

orderRoutes.post(
  "/",
  requireRoles(ROLES.CUSTOMER, ROLES.ADMIN),
  validateBody(createOrderSchema),
  orderController.create
);

orderRoutes.get(
  "/",
  requireRoles(ROLES.CUSTOMER, ROLES.ADMIN),
  orderController.list
);

orderRoutes.get(
  "/:id",
  requireRoles(ROLES.CUSTOMER, ROLES.ADMIN),
  orderController.getOne
);

orderRoutes.patch(
  "/:id/status",
  requireRoles(ROLES.ADMIN),
  validateBody(updateOrderStatusSchema),
  orderController.updateStatus
);

orderRoutes.patch(
  "/:id/cancel",
  requireRoles(ROLES.CUSTOMER, ROLES.ADMIN),
  orderController.cancel
);
