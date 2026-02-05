import { z } from "zod";

export const createOrderSchema = z
  .array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number().int().min(1, "Quantidade mínima é 1"),
    }),
  )
  .min(1, "O pedido deve conter pelo menos 1 item");

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
