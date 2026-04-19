import mongoose from "mongoose";
import { ORDER_STATUS } from "../constants/orderStatus.js";
import { ROLES } from "../constants/roles.js";
import type { Role } from "../constants/roles.js";
import { AppError } from "../errors/AppError.js";
import { Order, Product } from "../models/index.js";

/**
 * Creates an order without multi-document transactions (works on standalone MongoDB).
 * Stock is decremented atomically per line; if order insert fails, stock is rolled back.
 */
export async function createOrder(
  userId: string,
  items: { productId: string; quantity: number }[]
) {
  const lineItems: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
  }[] = [];
  let totalAmount = 0;
  const stockRollback: { productId: mongoose.Types.ObjectId; quantity: number }[] = [];

  try {
    for (const line of items) {
      const product = await Product.findOneAndUpdate(
        {
          _id: line.productId,
          isActive: true,
          stock: { $gte: line.quantity },
        },
        { $inc: { stock: -line.quantity } },
        { new: true }
      );

      if (!product) {
        throw new AppError(
          400,
          `Product not found, inactive, or insufficient stock: ${line.productId}`
        );
      }

      const unitPrice = product.price;
      totalAmount += unitPrice * line.quantity;
      stockRollback.push({
        productId: product._id as mongoose.Types.ObjectId,
        quantity: line.quantity,
      });
      lineItems.push({
        productId: product._id as mongoose.Types.ObjectId,
        quantity: line.quantity,
        unitPrice,
      });
    }

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(userId),
      items: lineItems,
      status: ORDER_STATUS.PENDING,
      totalAmount,
    });

    return order;
  } catch (err) {
    await Promise.all(
      stockRollback.map((d) =>
        Product.updateOne({ _id: d.productId }, { $inc: { stock: d.quantity } }).exec()
      )
    ).catch(() => {
      /* best-effort rollback */
    });
    throw err;
  }
}

export async function listOrders(userId: string, role: Role) {
  const filter =
    role === ROLES.ADMIN
      ? {}
      : { userId: new mongoose.Types.ObjectId(userId) };
  return Order.find(filter).sort({ createdAt: -1 }).lean();
}

export async function getOrder(id: string, userId: string, role: Role) {
  const order = await Order.findById(id);
  if (!order) throw new AppError(404, "Order not found");

  if (role !== ROLES.ADMIN && order.userId.toString() !== userId) {
    throw new AppError(403, "Forbidden");
  }

  return order;
}

export async function updateOrderStatus(id: string, status: string) {
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (!order) throw new AppError(404, "Order not found");
  return order;
}

export async function cancelOrder(id: string, userId: string, role: Role) {
  const order = await Order.findById(id);
  if (!order) throw new AppError(404, "Order not found");

  const isOwner = order.userId.toString() === userId;
  if (role !== ROLES.ADMIN && !isOwner) {
    throw new AppError(403, "Forbidden");
  }

  if (order.status !== ORDER_STATUS.PENDING) {
    throw new AppError(400, "Only pending orders can be cancelled");
  }

  order.status = ORDER_STATUS.CANCELLED;
  await order.save();
  return order;
}
