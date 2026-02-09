"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardSaleItem } from "../schemas/dashboard-sales.schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";

interface SaleDetailsDialogProps {
  sale: DashboardSaleItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaleDetailsDialog({
  sale,
  isOpen,
  onOpenChange,
}: SaleDetailsDialogProps) {
  if (!sale) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <div className="flex justify-between items-start pr-8">
            <div>
              <DialogTitle className="text-2xl font-heading font-bold text-card-foreground">
                Detalhes do Pedido
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                ID: {sale.id}
              </p>
            </div>
            <StatusBadge status={sale.status} />
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-8 py-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              Cliente
            </span>
            <span className="text-card-foreground font-medium">
              {sale.user.name}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              Data do Pedido
            </span>
            <span className="text-card-foreground font-medium">
              {format(
                new Date(sale.createdAt),
                "dd 'de' MMMM 'de' yyyy, HH:mm",
                {
                  locale: ptBR,
                },
              )}
            </span>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="flex flex-col gap-4 py-4">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
            Itens do Pedido ({sale.orderItem.length})
          </span>

          <div className="max-h-[300px] overflow-y-auto pr-2 flex flex-col gap-4">
            {sale.orderItem.map((item, index) => (
              <div key={index} className="flex gap-4 items-center">
                <div
                  className="size-16 rounded bg-muted bg-cover bg-center shrink-0 border border-border"
                  style={{
                    backgroundImage: item.book.coverThumbUrl
                      ? `url(${item.book.coverThumbUrl})`
                      : "none",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-card-foreground line-clamp-1">
                    {item.book.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {item.book.author}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-card-foreground">
                    {item.quantity}x{" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.priceAtTime)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Subtotal:{" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.quantity * item.priceAtTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="flex justify-between items-center py-2">
          <span className="text-lg font-bold text-card-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(sale.total)}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
