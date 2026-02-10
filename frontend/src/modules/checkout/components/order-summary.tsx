"use client";

import { useCartStore } from "@/modules/cart/store/cart.store";
import { Button } from "@/components/ui/button"; // Accessing shadcn button
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Lock } from "lucide-react";

export function OrderSummary({
  isSubmitting,
  onSubmit,
}: {
  isSubmitting: boolean;
  onSubmit: () => void;
}) {
  const items = useCartStore((state) => state.items);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = 0; // Fixed shipping for now
  const total = subtotal + shipping;

  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden sticky top-24">
      <div className="p-6 border-b border-border bg-muted/50">
        <h2 className="text-xl font-bold">Resumo do Pedido</h2>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="space-y-3">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-medium text-foreground">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Frete</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              Grátis
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-end">
          <span className="text-lg font-bold">Total</span>
          <div className="text-right">
            <span className="text-xs text-muted-foreground block mb-1">
              em até 3x sem juros
            </span>
            <span className="text-3xl font-bold text-primary leading-none">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(total)}
            </span>
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting || items.length === 0}
          className="w-full text-lg py-6 gap-2"
        >
          <span>{isSubmitting ? "Processando..." : "Finalizar Pedido"}</span>
          {!isSubmitting && <ArrowRight className="w-5 h-5" />}
        </Button>

        <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs mt-2">
          <Lock className="w-3.5 h-3.5" />
          <span>Compra 100% Segura</span>
        </div>
      </div>
    </div>
  );
}
