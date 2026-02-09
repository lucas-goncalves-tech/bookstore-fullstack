import { z } from "zod";

export const dashboardDetailsSchema = z.object({
  revenue: z.string().transform((val) => Number(val)),
  totalUsers: z.number(),
  sales: z.number(),
});

export type DashboardDetails = z.infer<typeof dashboardDetailsSchema>;
