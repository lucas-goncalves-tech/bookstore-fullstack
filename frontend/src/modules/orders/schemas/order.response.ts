import { z } from "zod";

export const ordersResponseSchema = z.array(
  z.object({
    id: z.uuid(),
    createdAt: z.string(),
    total: z.string(),
    status: z.enum(["CONFIRMED", "PENDING"]),
    _count: z.object({
      orderItem: z.number(),
    }),
  }),
);
export type OrderResponse = z.infer<typeof ordersResponseSchema>;

export const orderDetailResponseSchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  total: z.string(),
  status: z.enum(["CONFIRMED", "PENDING"]),
  userId: z.string(),
  orderItem: z.array(
    z.object({
      priceAtTime: z.string(),
      quantity: z.number(),
      book: z.object({
        id: z.uuid(),
        title: z.string(),
        author: z.string(),
        coverThumbUrl: z.string().nullable(),
        category: z.object({
          name: z.string(),
        }),
      }),
    }),
  ),
});
export type OrderDetailResponse = z.infer<typeof orderDetailResponseSchema>;
