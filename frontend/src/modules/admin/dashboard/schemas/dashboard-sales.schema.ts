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

export const dashboardSalesSchema = z.array(dashboardSaleItemSchema);

export type DashboardSaleItem = z.infer<typeof dashboardSaleItemSchema>;
export type DashboardSales = z.infer<typeof dashboardSalesSchema>;
