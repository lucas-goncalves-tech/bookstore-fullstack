"use client";

import { ShoppingBag, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BookPriceCardProps {
  price: number;
  stock: number;
  title: string;
  originalPrice?: number;
}

export function BookPriceCard({
  price,
  stock,
  title,
  originalPrice,
}: BookPriceCardProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  const formattedOriginalPrice = originalPrice
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(originalPrice)
    : null;

  const installmentValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price / 3);

  const handleAddToCart = () => {
    toast.success(`"${title}" adicionado ao carrinho!`);
  };

  const handleBuyNow = () => {
    toast.info("Funcionalidade em desenvolvimento");
  };

  return (
    <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Preço */}
      <div className="mb-2 flex items-end gap-3">
        <span className="text-4xl font-bold text-primary">{formattedPrice}</span>
        {hasDiscount && (
          <>
            <span className="mb-1 text-lg text-muted-foreground line-through">
              {formattedOriginalPrice}
            </span>
            <span className="mb-2 rounded bg-green-100 px-2 py-0.5 text-sm font-bold text-green-700 dark:bg-green-900 dark:text-green-300">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* Parcelamento */}
      <p className="mb-6 text-sm text-muted-foreground">
        Em até 3x de {installmentValue} sem juros no cartão.
      </p>

      {/* Botões */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="h-12 flex-1 gap-2 text-base font-bold shadow-md"
        >
          <ShoppingBag className="size-5" />
          Adicionar ao Carrinho
        </Button>
        <Button
          variant="outline"
          onClick={handleBuyNow}
          disabled={stock === 0}
          className="h-12 flex-1 border-2 text-base font-bold transition-all hover:border-primary hover:text-primary"
        >
          Comprar Agora
        </Button>
      </div>

      {/* Status de estoque */}
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        {stock > 0 ? (
          <>
            <CheckCircle className="size-4 text-green-600" />
            <span>
              Em estoque. Entregue por{" "}
              <span className="font-bold">BookStore</span>.
            </span>
          </>
        ) : (
          <span className="font-medium text-destructive">
            Produto indisponível
          </span>
        )}
      </div>
    </div>
  );
}
