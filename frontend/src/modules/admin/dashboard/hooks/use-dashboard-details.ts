"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  dashboardDetailsSchema,
  type DashboardDetails,
} from "../schemas/dashboard-details.schema";

interface UseDashboardDetailsOptions {
  initialData?: DashboardDetails | null;
}

export function useDashboardDetails(options: UseDashboardDetailsOptions = {}) {
  return useQuery({
    queryKey: ["dashboard", "details"],
    queryFn: async () => {
      const response = await api.get("/dashboard/details");
      return dashboardDetailsSchema.parse(response.data);
    },
    initialData: options.initialData ?? undefined,
    staleTime: 0, // Always revalidate on client
  });
}
