import z from "zod";

export const dashboardDetailsSchema = z.object({
  revenue: z.number(),
  totalUsers: z.number(),
  sales: z.number(),
});

export const dashboardSalesSchema = z.object({
  sales: z.array(
    z.object({
      id: z.string(),
      total: z.any(),
      status: z.any(),
      createdAt: z.date(),
      user: z.object({
        name: z.string(),
      }),
      orderItem: z.array(
        z.object({
          quantity: z.number(),
          priceAtTime: z.any(),
          book: z.object({
            title: z.string(),
            author: z.string(),
            coverThumbUrl: z.string().nullable(),
          }),
        }),
      ),
    }),
  ),
  metadata: z.object({
    page: z.number(),
    total: z.number(),
    totalPage: z.number(),
  }),
});
