"use client";

import { useQuery } from "@tanstack/react-query";

export interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

// Mock data function
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    totalBooks: 124,
    totalUsers: 45,
    totalOrders: 12,
    totalRevenue: 15430.5,
  };
};

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: fetchDashboardStats,
  });
}
