import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative(),
});

/** Matches OpenAPI `UpdateProductRequest`; coerces string numbers from some clients. */
export const updateProductSchema = createProductSchema.partial().extend({
  isActive: z.boolean().optional(),
});
