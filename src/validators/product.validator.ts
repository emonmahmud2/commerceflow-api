import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
});

export const updateProductSchema = createProductSchema.partial();
