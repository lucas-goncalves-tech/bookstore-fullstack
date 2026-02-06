"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ordersResponseSchema } from "../../schemas/order.response";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get("/orders");
      return ordersResponseSchema.parse(response.data);
    },
  });
}
