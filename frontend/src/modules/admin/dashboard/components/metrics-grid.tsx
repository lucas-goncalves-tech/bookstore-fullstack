"use client";

import { useDashboardDetails } from "../hooks/use-dashboard-details";
import { LibraryBig, CircleDollarSign, Users, TrendingUp } from "lucide-react";
import { SkeletonMetrics } from "./skeleton-metrics";
import type { DashboardDetails } from "../schemas/dashboard-details.schema";

interface MetricsGridProps {
  initialData?: DashboardDetails | null;
}

export function MetricsGrid({ initialData }: MetricsGridProps) {
  const {
    data: details,
    isLoading,
    error,
  } = useDashboardDetails({ initialData });

  if (isLoading && !details) {
    return <SkeletonMetrics />;
  }

  if (error || !details) return null;

  const metrics = [
    {
      title: "Vendas Totais",
      value: details.sales,
      icon: LibraryBig,
      trend: "+2.5%",
    },
    {
      title: "Receita Total",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(details.revenue),
      icon: CircleDollarSign,
      trend: "+12%",
    },
    {
      title: "Total de Usuários",
      value: details.totalUsers,
      icon: Users,
      trend: "+45",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-card p-6 rounded-xl shadow-sm border border-border flex flex-col gap-4 group hover:border-primary/30 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-muted rounded-lg text-primary group-hover:bg-primary/5 transition-colors">
              <metric.icon className="size-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
              <TrendingUp className="size-3" /> {metric.trend}
            </span>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium font-sans italic">
              {metric.title}
            </p>
            <h3 className="text-3xl font-heading font-bold text-card-foreground mt-1">
              {metric.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
