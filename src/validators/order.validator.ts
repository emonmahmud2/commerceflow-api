import { z } from "zod";
import { ORDER_STATUS } from "../constants/orderStatus.js";

const orderStatuses = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CANCELLED,
] as const;

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses),
});
