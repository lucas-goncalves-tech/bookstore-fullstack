import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  CreateOrderInput,
  createOrderResponseSchema,
} from "../schemas/order.schema";
import { toast } from "sonner";
import { useCartStore } from "@/modules/cart/store/cart.store";
import { bookQueryKeys } from "@/modules/book/hooks/query-keys";
import { orderQueryKeys } from "./query-keys";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: async (data: CreateOrderInput) => {
      const response = await api.post("/orders", data);
      return createOrderResponseSchema.parse(response.data);
    },
    onSuccess: () => {
      toast.success("Pedido realizado com sucesso!");
      clearCart();
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: bookQueryKeys.all });
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
