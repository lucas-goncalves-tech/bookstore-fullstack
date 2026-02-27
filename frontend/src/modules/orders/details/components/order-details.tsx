"use client";

import { useOrderDetails } from "../hooks/use-order-details";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "@/components/ui/status-badge";
import type { OrderDetailResponse } from "../../schemas/order.response";

interface OrderDetailsViewProps {
  orderId: string;
  initialData?: OrderDetailResponse | null;
}

export function OrderDetailsView({ orderId, initialData }: OrderDetailsViewProps) {
  const { data: order, isLoading } = useOrderDetails(orderId, initialData);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-lg border bg-card overflow-hidden">
              <div className="p-4 bg-muted/40 border-b">
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="divide-y">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="p-4 flex gap-4">
                    <Skeleton className="w-16 h-24 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-24 mt-4" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="my-2 border-t" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <div className="flex gap-3">
                <Skeleton className="size-5 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Pedido não encontrado.</p>
        <Button asChild variant="outline">
          <Link href="/orders">Voltar para Pedidos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Pedido #{order.id.slice(0, 8)}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            Realizado em{" "}
            {new Date(order.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="w-fit">
          <Link href="/orders">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="p-4 bg-muted/40 border-b flex items-center gap-2 font-medium">
              <Package className="w-4 h-4" />
              Itens do Pedido ({order.orderItem.length})
            </div>
            <div className="divide-y">
              {order.orderItem.map((item, index) => (
                <div key={index} className="p-4 flex gap-4">
                  <div className="relative w-16 h-24 shrink-0 bg-muted rounded overflow-hidden">
                    {item.book.coverThumbUrl ? (
                      <Image
                        src={item.book.coverThumbUrl}
                        alt={item.book.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        Sem capa
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.book.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.book.author}
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(item.priceAtTime))}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        x {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-bold">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(item.priceAtTime) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Summary & Info */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium mb-4">Resumo do Pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(order.total))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-green-600">Grátis</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(order.total))}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info (Mocked for now as detailed in ai-files) */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium text-sm">Endereço de Entrega</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Rua Exemplo, 123
                  <br />
                  Bairro - Cidade/UF
                  <br />
                  CEP: 00000-000
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium text-sm">Pagamento</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Cartão de Crédito
                  <br />
                  **** **** **** 1234
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
