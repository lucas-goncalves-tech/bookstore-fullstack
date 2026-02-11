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

export const orderItemResponseDto = z.object({
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

export const orderResponseDto = z.object({
  id: z.string(),
  userId: z.string(),
  total: z.number(),
  status: z.enum(["PENDING", "CONFIRMED"]),
  createdAt: z.date(),
});

export const createOrderResponseDto = z.object({
  message: z.string(),
  data: orderResponseDto,
});

export const findManyOrdersResponseDto = z.array(
  orderResponseDto.extend({
    _count: z.object({
      orderItem: z.number(),
    }),
  }),
);

export const findOrderByIdResponseDto = orderResponseDto.extend({
  orderItem: z.array(orderItemResponseDto),
});
