"use client";

import { useCartStore } from "@/modules/cart/store/cart.store";
import { CartItem } from "@/modules/cart/components/cart-item";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CheckoutItemList() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Seu carrinho está vazio.</p>
        <Button asChild variant="link">
          <Link href="/">Voltar para a loja</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between border-b border-border pb-4">
        <h1 className="text-3xl font-bold">Seu Carrinho</h1>
        <span className="text-muted-foreground text-sm font-medium">
          {items.length} itens
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-primary font-medium hover:underline mt-2 self-start"
      >
        <ArrowLeft className="w-4 h-4" />
        Continuar Comprando
      </Link>
    </div>
  );
}
