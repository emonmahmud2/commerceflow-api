import mongoose from "mongoose";
import { ORDER_STATUS } from "../constants/orderStatus.js";
import { ROLES } from "../constants/roles.js";
import type { Role } from "../constants/roles.js";
import { AppError } from "../errors/AppError.js";
import { Order, Product } from "../models/index.js";

export async function createOrder(
  userId: string,
  items: { productId: string; quantity: number }[]
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const lineItems: {
      productId: mongoose.Types.ObjectId;
      quantity: number;
      unitPrice: number;
    }[] = [];
    let totalAmount = 0;

    for (const line of items) {
      const product = await Product.findById(line.productId).session(session);
      if (!product || !product.isActive) {
        throw new AppError(400, `Product not found: ${line.productId}`);
      }
      if (product.stock < line.quantity) {
        throw new AppError(400, `Insufficient stock for ${product.name}`);
      }

      const unitPrice = product.price;
      totalAmount += unitPrice * line.quantity;
      lineItems.push({
        productId: product._id,
        quantity: line.quantity,
        unitPrice,
      });

      product.stock -= line.quantity;
      await product.save({ session });
    }

    const [order] = await Order.create(
      [
        {
          userId: new mongoose.Types.ObjectId(userId),
          items: lineItems,
          status: ORDER_STATUS.PENDING,
          totalAmount,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return order;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
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
