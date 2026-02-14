"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
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
  return useInfiniteQuery({
    queryKey: adminDashboardKeys.sales(),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/dashboard/sales", {
        params: { page: pageParam },
      });
      return dashboardSalesSchema.parse(response.data);
    },
    getNextPageParam: (lastPage: DashboardSales) => {
      if (lastPage.metadata.page < lastPage.metadata.totalPage) {
        return lastPage.metadata.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    throwOnError: true,
    initialData: options.initialData
      ? {
          pages: [options.initialData],
          pageParams: [1],
        }
      : undefined,
    // Cache curto para métricas em tempo real
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
  });
}
