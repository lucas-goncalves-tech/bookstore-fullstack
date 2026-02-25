"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  orderDetailResponseSchema,
  type OrderDetailResponse,
} from "../../schemas/order.response";

export function useOrderDetails(
  id: string,
  initialData?: OrderDetailResponse | null,
) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await api.get(`/users/me/orders/${id}`);
      return orderDetailResponseSchema.parse(response.data);
    },
    initialData: initialData ?? undefined,
    enabled: !!id,
    throwOnError: true,
  });
}
