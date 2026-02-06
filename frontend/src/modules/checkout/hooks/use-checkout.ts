"use client";

import { useCartStore } from "@/modules/cart/store/cart.store";
import { useCreateOrder } from "@/modules/orders/hooks/use-create-order";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCheckout() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const { mutateAsync: createOrder, isPending: isCreatingOrder } =
    useCreateOrder();

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }

    try {
      const orderPayload = cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      const newOrder = await createOrder(orderPayload);
      clearCart();

      router.push(`/orders/${newOrder.data.id}`);
    } catch (error) {
      console.error("Checkout failed", error);
    }
  };

  return {
    onSubmit: handleCheckout,
    isSubmitting: isCreatingOrder,
    cartItems,
  };
}
