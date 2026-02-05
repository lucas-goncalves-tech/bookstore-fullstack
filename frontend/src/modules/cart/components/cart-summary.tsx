import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "../store/cart.store";
import { useCreateOrder } from "@/modules/orders/hooks/use-create-order";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";

interface CartSummaryProps {
  onClose: () => void;
}

export function CartSummary({ onClose }: CartSummaryProps) {
  const { getTotalPrice, items } = useCartStore();
  const { user } = useUser();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const total = getTotalPrice();
  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total);

  const handleCheckout = () => {
    if (!user) {
      toast.error("Você precisa estar logado para finalizar a compra.");
      // Optional: Redirect to login or open login modal
      return;
    }

    const orderData = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    if (orderData.length === 0) return;

    createOrder(orderData, {
      onSuccess: () => {
        onClose();
      },
    });
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
          Frete calculado no checkout (fake)
        </p>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handleCheckout}
        disabled={isPending || items.length === 0}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {user ? "Finalizar Compra" : "Entre para Comprar"}
      </Button>
    </div>
  );
}
