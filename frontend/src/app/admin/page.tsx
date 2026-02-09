import { DashboardHeader } from "@/modules/admin/dashboard/components/dashboard-header";
import { MetricsGrid } from "@/modules/admin/dashboard/components/metrics-grid";
import { RecentSalesTable } from "@/modules/admin/dashboard/components/recent-sales-table";
import { serverGet } from "@/lib/server-fetch";
import type { DashboardDetails } from "@/modules/admin/dashboard/schemas/dashboard-details.schema";
import type { DashboardSales } from "@/modules/admin/dashboard/schemas/dashboard-sales.schema";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Fetch initial data on server (SSR)
  // Returns null if 401 - client will handle refresh and refetch
  const [detailsData, salesData] = await Promise.all([
    serverGet<DashboardDetails>("/dashboard/details"),
    serverGet<DashboardSales>("/dashboard/sales"),
  ]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <DashboardHeader />
      <MetricsGrid initialData={detailsData} />
      <RecentSalesTable initialData={salesData} />
    </div>
  );
}
