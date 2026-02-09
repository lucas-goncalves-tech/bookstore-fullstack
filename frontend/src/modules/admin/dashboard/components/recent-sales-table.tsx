"use client";

import { useDashboardSales } from "../hooks/use-dashboard-sales";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SkeletonSales } from "./skeleton-sales";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { SaleDetailsDialog } from "./sale-details-dialog";
import {
  DashboardSaleItem,
  DashboardSales,
} from "../schemas/dashboard-sales.schema";
import { StatusBadge } from "@/components/ui/status-badge";

interface RecentSalesTableProps {
  initialData?: DashboardSales | null;
}

export function RecentSalesTable({ initialData }: RecentSalesTableProps) {
  const { data: sales, isLoading, error } = useDashboardSales({ initialData });
  const [selectedSale, setSelectedSale] = useState<DashboardSaleItem | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading && !sales) {
    return <SkeletonSales />;
  }

  if (error || !sales) return null;

  const handleRowClick = (sale: DashboardSaleItem) => {
    setSelectedSale(sale);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-heading font-bold text-card-foreground">
          Últimas Vendas
        </h3>
        <Link
          href="/admin/orders"
          className="text-primary text-sm font-bold font-sans hover:underline"
        >
          Ver todos
        </Link>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-4 px-6 text-xs font-bold font-sans text-muted-foreground uppercase tracking-wider">
                  Livro
                </th>
                <th className="py-4 px-6 text-xs font-bold font-sans text-muted-foreground uppercase tracking-wider">
                  Cliente
                </th>
                <th className="py-4 px-6 text-xs font-bold font-sans text-muted-foreground uppercase tracking-wider">
                  Data
                </th>
                <th className="py-4 px-6 text-xs font-bold font-sans text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-xs font-bold font-sans text-muted-foreground uppercase tracking-wider text-right">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sales.map((sale) => {
                const firstItem = sale.orderItem[0];
                return (
                  <tr
                    key={sale.id}
                    onClick={() => handleRowClick(sale)}
                    className="group hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-12 w-9 rounded bg-muted bg-cover bg-center shadow-sm"
                          style={{
                            backgroundImage: firstItem?.book.coverThumbUrl
                              ? `url(${firstItem.book.coverThumbUrl})`
                              : "none",
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-card-foreground line-clamp-1">
                            {firstItem?.book.title || "N/A"}
                            {sale.orderItem.length > 1 && (
                              <span className="text-primary ml-1">
                                +{sale.orderItem.length - 1}
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {firstItem?.book.author || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6 border border-border">
                          <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                            {sale.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-card-foreground font-medium">
                          {sale.user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground font-sans">
                      {isToday(new Date(sale.createdAt))
                        ? `Hoje, ${format(new Date(sale.createdAt), "HH:mm")}`
                        : isYesterday(new Date(sale.createdAt))
                          ? `Ontem, ${format(new Date(sale.createdAt), "HH:mm")}`
                          : format(
                              new Date(sale.createdAt),
                              "dd 'de' MMM, HH:mm",
                              {
                                locale: ptBR,
                              },
                            )}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={sale.status} />
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-card-foreground text-right">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(sale.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border bg-muted/20 flex justify-center">
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-muted-foreground uppercase hover:text-primary transition-colors"
          >
            Carregar mais
          </Link>
        </div>
      </div>

      <SaleDetailsDialog
        sale={selectedSale}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
