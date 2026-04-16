import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { orderRoutes } from "./order.routes.js";
import { productRoutes } from "./product.routes.js";
import { userRoutes } from "./user.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/products", productRoutes);
apiRouter.use("/orders", orderRoutes);
