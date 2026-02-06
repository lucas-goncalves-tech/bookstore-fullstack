"use client";

import { useOrderDetails } from "../hooks/use-order-details";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

export function OrderDetailsView({ orderId }: { orderId: string }) {
  const { data: order, isLoading } = useOrderDetails(orderId);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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

  const status = statusMap[order.status] || {
    label: order.status,
    color: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Pedido #{order.id.slice(0, 8)}
            </h1>
            <Badge variant="outline" className={`font-normal ${status.color}`}>
              {status.label}
            </Badge>
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
