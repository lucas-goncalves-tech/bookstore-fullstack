import { z } from "zod";

export const createOrderSchema = z
  .array(
    z.object({
      id: z.uuid(),
      quantity: z.number().int().min(1, "Quantidade mínima é 1"),
    }),
  )
  .min(1, "O pedido deve conter pelo menos 1 item");

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const createOrderResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.uuid(),
    userId: z.string(),
    total: z.string(),
    status: z.string(),
    createdAt: z.string(),
  }),
});

export type CreateOrderResponse = z.infer<typeof createOrderResponseSchema>;
