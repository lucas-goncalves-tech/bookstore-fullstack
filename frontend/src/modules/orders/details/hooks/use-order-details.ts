"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { orderDetailResponseSchema } from "../../schemas/order.response";

export function useOrderDetails(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await api.get(`/orders/${id}`);
      console.log(response.data);
      return orderDetailResponseSchema.parse(response.data);
    },
    enabled: !!id,
    throwOnError: true,
  });
}
