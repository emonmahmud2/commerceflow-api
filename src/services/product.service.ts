import { AppError } from "../errors/AppError.js";
import { Product } from "../models/index.js";

export async function listProducts() {
  return Product.find({ isActive: true }).sort({ createdAt: -1 }).lean();
}

export async function getProduct(id: string) {
  const product = await Product.findOne({ _id: id, isActive: true });
  if (!product) throw new AppError(404, "Product not found");
  return product;
}

export async function createProduct(input: {
  name: string;
  price: number;
  stock: number;
}) {
  return Product.create(input);
}

export async function updateProduct(
  id: string,
  input: Partial<{ name: string; price: number; stock: number; isActive: boolean }>
) {
  const product = await Product.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError(404, "Product not found");
  return product;
}

export async function deleteProduct(id: string) {
  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!product) throw new AppError(404, "Product not found");
  return product;
}
