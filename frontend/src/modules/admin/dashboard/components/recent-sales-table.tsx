"use client";

import { useDashboardSales } from "../hooks/use-dashboard-sales";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SkeletonSales } from "./skeleton-sales";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { SaleDetailsDialog } from "./sale-details-dialog";
import {
  DashboardSaleItem,
  DashboardSales,
} from "../schemas/dashboard-sales.schema";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React from "react";

interface RecentSalesTableProps {
  initialData?: DashboardSales | null;
}

export function RecentSalesTable({ initialData }: RecentSalesTableProps) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDashboardSales({ initialData });

  const [selectedSale, setSelectedSale] = useState<DashboardSaleItem | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading && !data) {
    return <SkeletonSales />;
  }

  if (error || !data) return null;

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
      </div>

      <div className="rounded-lg shadow-sm border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Livro</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.sales.map((sale) => {
                  const firstItem = sale.orderItem[0];
                  return (
                    <TableRow
                      key={sale.id}
                      onClick={() => handleRowClick(sale)}
                      className="group cursor-pointer"
                    >
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6 border border-border">
                            <AvatarFallback className="text-[10px]text-muted-foreground">
                              {sale.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-card-foreground font-medium">
                            {sale.user.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground font-sans">
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
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={sale.status} />
                      </TableCell>
                      <TableCell className="text-sm font-bold text-card-foreground text-right">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(sale.total)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        {hasNextPage && (
          <div className="p-4 border-t border-border bg-muted/20 flex justify-center">
            <Button
              variant="ghost"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-xs font-bold text-muted-foreground uppercase hover:text-primary transition-colors"
            >
              {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
            </Button>
          </div>
        )}
      </div>

      <SaleDetailsDialog
        sale={selectedSale}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
