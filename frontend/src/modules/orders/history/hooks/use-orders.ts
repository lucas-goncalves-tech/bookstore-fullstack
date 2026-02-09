"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  ordersResponseSchema,
  type OrderResponse,
} from "../../schemas/order.response";

interface UseOrdersOptions {
  initialData?: OrderResponse | null;
}

export function useOrders(options: UseOrdersOptions = {}) {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get("/orders");
      return ordersResponseSchema.parse(response.data);
    },
    initialData: options.initialData ?? undefined,
    staleTime: 0,
  });
}
