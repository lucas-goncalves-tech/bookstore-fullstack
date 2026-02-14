"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  dashboardDetailsSchema,
  type DashboardDetails,
} from "../schemas/dashboard-details.schema";
import { adminDashboardKeys } from "./query-keys";

interface UseDashboardDetailsOptions {
  initialData?: DashboardDetails | null;
}

export function useDashboardDetails(options: UseDashboardDetailsOptions = {}) {
  return useQuery({
    queryKey: adminDashboardKeys.details(),
    queryFn: async () => {
      const response = await api.get("/dashboard/details");
      return dashboardDetailsSchema.parse(response.data);
    },
    initialData: options.initialData || undefined,
    // Cache curto para métricas em tempo real (30 segundos)
    staleTime: 30 * 1000,
    // Refetcha quando volta para a aba
    refetchOnWindowFocus: true,
    // Refetcha a cada 30 segundos automaticamente
    refetchInterval: 30 * 1000,
    retry: false,
  });
}
