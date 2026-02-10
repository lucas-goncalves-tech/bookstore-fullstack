export const adminDashboardKeys = {
  all: ["dashboard"] as const,
  sales: () => [...adminDashboardKeys.all, "sales"] as const,
  details: () => [...adminDashboardKeys.all, "details"] as const,
} as const;
