import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { CreateOrderInput } from "../schemas/order.schema";
import { toast } from "sonner";
import { useCartStore } from "@/modules/cart/store/cart.store";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: async (data: CreateOrderInput) => {
      const response = await api.post("/orders", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Pedido realizado com sucesso!");
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] }); // Invalidate list if exists
      // router.push("/orders"); // Uncomment if we want to redirect to orders list
    },
    onError: async (error) => {
      console.error(error);
      if (error instanceof Error) {
        const message = error.message || "Erro ao realizar o pedido.";
        toast.error(message);
      }
    },
  });
}
