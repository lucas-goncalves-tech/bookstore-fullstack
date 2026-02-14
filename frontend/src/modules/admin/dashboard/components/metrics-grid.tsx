"use client";

import { useDashboardDetails } from "../hooks/use-dashboard-details";
import { LibraryBig, CircleDollarSign, Users } from "lucide-react";
import { SkeletonMetrics } from "./skeleton-metrics";
import type { DashboardDetails } from "../schemas/dashboard-details.schema";

interface MetricsGridProps {
  initialData?: DashboardDetails | null;
}

export function MetricsGrid({ initialData }: MetricsGridProps) {
  const { data: details, isLoading } = useDashboardDetails({ initialData });

  // Só mostra skeleton se realmente não tem dados e está carregando
  if (isLoading && !details && !initialData) {
    return <SkeletonMetrics />;
  }

  // Pega os dados reais (do fetch ou do SSR), tratando null como 0
  const rawData = details || initialData;
  const metricsData = {
    sales: rawData?.sales ?? 0,
    revenue: rawData?.revenue ?? 0,
    totalUsers: rawData?.totalUsers ?? 0,
  };

  console.log(rawData);

  const metrics = [
    {
      title: "Vendas Totais",
      value: metricsData.sales,
      icon: LibraryBig,
    },
    {
      title: "Receita Total",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(metricsData.revenue),
      icon: CircleDollarSign,
    },
    {
      title: "Total de Usuários",
      value: metricsData.totalUsers,
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-card p-6 rounded-lg shadow-sm border border-border flex flex-col gap-4 group hover:border-primary/30 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-muted rounded-lg text-primary group-hover:bg-primary/5 transition-colors">
              <metric.icon className="size-6" />
            </div>
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
