"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "../store/cart.store";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";

interface CartSummaryProps {
  onClose: () => void;
}

export function CartSummary({ onClose }: CartSummaryProps) {
  const { getTotalPrice, items } = useCartStore();
  const { user } = useUser();
  const isAuthenticated = !!user;
  const router = useRouter();

  const total = getTotalPrice();
  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total);

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Separator />
      <div className="space-y-1.5_">
        <div className="flex items-center justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formattedTotal}</span>
        </div>
        <p className="text-xs text-muted-foreground text-right">
          Frete calculado no checkout
        </p>
      </div>

      {isAuthenticated ? (
        <Button
          size="lg"
          className="w-full"
          onClick={handleCheckout}
          disabled={items.length === 0}
        >
          Ir para o Pagamento
        </Button>
      ) : (
        <Button size="lg" className="w-full" asChild>
          <Link href="/auth">Fazer Login</Link>
        </Button>
      )}
    </div>
  );
}
