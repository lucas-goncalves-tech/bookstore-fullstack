import { DashboardMetrics } from "@/modules/admin/dashboard/components/dashboard-metrics"

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <DashboardMetrics />
    </div>
  )
}
