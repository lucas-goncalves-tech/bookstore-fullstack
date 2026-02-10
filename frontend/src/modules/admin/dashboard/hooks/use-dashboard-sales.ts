"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  dashboardSalesSchema,
  type DashboardSales,
} from "../schemas/dashboard-sales.schema";
import { adminDashboardKeys } from "./query-keys";

interface UseDashboardSalesOptions {
  initialData?: DashboardSales | null;
}

export function useDashboardSales(options: UseDashboardSalesOptions = {}) {
  return useQuery({
    queryKey: adminDashboardKeys.sales(),
    queryFn: async () => {
      const response = await api.get("/dashboard/sales");
      return dashboardSalesSchema.parse(response.data);
    },
    initialData: options.initialData ?? undefined,
    staleTime: 0, // Always revalidate on client
  });
}
