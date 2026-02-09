"use client";

import { useOrders } from "../hooks/use-orders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SkeletonOrderList } from "./skeleton-order-list";
import type { OrderResponse } from "../../schemas/order.response";

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: {
    label: "Pendente",
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
  CONFIRMED: {
    label: "Confirmado",
    color: "bg-green-100 text-green-800 border-green-200",
  },
};

interface OrderListProps {
  initialData?: OrderResponse | null;
}

export function OrderList({ initialData }: OrderListProps) {
  const { data: orders, isLoading } = useOrders({ initialData });

  if (isLoading && !orders) {
    return <SkeletonOrderList />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground mb-4">
          Você ainda não tem pedidos.
        </p>
        <Button asChild>
          <Link href="/">Começar a comprar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID do Pedido</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const status = statusMap[order.status] || {
              label: order.status,
              color: "bg-gray-100 text-gray-800",
            };
            return (
              <TableRow key={order.id} className="group">
                <TableCell className="font-medium">
                  <div className="font-mono text-xs text-muted-foreground">
                    #{order.id.slice(0, 8)}...
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {order._count?.orderItem || 0} Itens
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`font-normal ${status.color}`}
                  >
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(order.total))}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-primary hover:text-primary"
                  >
                    <Link href={`/orders/${order.id}`}>
                      Ver Detalhes
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
