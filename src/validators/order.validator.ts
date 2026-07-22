import { z } from "zod";

export const createOrderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});