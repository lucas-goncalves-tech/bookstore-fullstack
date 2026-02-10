import { z } from "zod";

export const dashboardSaleItemSchema = z.object({
  id: z.string(),
  status: z.enum(["CONFIRMED", "PENDING"]),
  total: z.string().transform((val) => Number(val)),
  createdAt: z.string(),
  user: z.object({
    name: z.string(),
  }),
  orderItem: z.array(
    z.object({
      quantity: z.number(),
      priceAtTime: z.string().transform((val) => Number(val)),
      book: z.object({
        title: z.string(),
        author: z.string(),
        coverThumbUrl: z.string().nullable(),
      }),
    }),
  ),
});

const dashboardSalesMetadata = z.object({
  page: z.number(),
  total: z.number(),
  totalPage: z.number(),
});

export const dashboardSalesSchema = z.object({
  sales: z.array(dashboardSaleItemSchema),
  metadata: dashboardSalesMetadata,
});

export type DashboardSaleItem = z.infer<typeof dashboardSaleItemSchema>;
export type DashboardSales = z.infer<typeof dashboardSalesSchema>;
