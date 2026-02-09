"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { myReviewsQueryKeys } from "./query-keys";
import {
  myReviewsResponseSchema,
  MyReviewsResponse,
} from "../schemas/my-reviews.schema";

export function useMyReviews(initialData?: MyReviewsResponse | null) {
  return useQuery({
    queryKey: myReviewsQueryKeys.list(),
    queryFn: async () => {
      const { data } = await api.get<MyReviewsResponse>("/reviews");
      return myReviewsResponseSchema.parse(data);
    },
    initialData: initialData ?? undefined,
  });
}
