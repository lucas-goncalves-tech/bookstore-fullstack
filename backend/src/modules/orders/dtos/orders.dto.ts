import z from "zod";
import { zodCoerceNumber } from "../../../shared/validators/comom.validators";

export const createOrderDto = z
  .array(
    z.strictObject({
      id: z.uuid(),
      quantity: zodCoerceNumber
        .nonnegative()
        .min(1, "Precisa comprar pelo menos 1 livro"),
    }),
  )
  .nonempty();

export type CreateOrderDto = z.infer<typeof createOrderDto>;

const orderItem = z.object({
  priceAtTime: z.number(),
  quantity: z.number(),
  book: z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    coverThumbUrl: z.string(),
    category: z.object({
      name: z.string(),
    }),
  }),
});

const order = z.object({
  id: z.string(),
  userId: z.string(),
  total: z.number(),
  status: z.enum(["PENDING", "CONFIRMED"]),
  createdAt: z.date(),
});

export const createOrderResponse = z.object({
  message: z.string(),
  data: order,
});

export const findManyOrdersResponse = z.array(
  order.extend({
    _count: z.object({
      orderItem: z.number(),
    }),
  }),
);

export const findOrderByIdResponse = order.extend({
  orderItem: z.array(orderItem),
});
