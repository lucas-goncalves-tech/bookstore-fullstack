import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { adminReviewKeys } from "./query-keys";
import { AdminReviewsResponse } from "../schemas/admin-review.schema";

export type AdminReviewQueryParams = {
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
  search?: string;
};

const fetchReviews = async (
  params: AdminReviewQueryParams = { page: 1, limit: 10 },
): Promise<AdminReviewsResponse> => {
  const { data } = await api.get<AdminReviewsResponse>("/admin/reviews", {
    params,
  });
  return data;
};

export function useAdminReviews(
  params: AdminReviewQueryParams = { page: 1, limit: 10 },
  initialData?: AdminReviewsResponse | null,
) {
  const isInitialDataValid =
    params.page === 1 && !params.order && !params.search;

  return useQuery({
    queryKey: adminReviewKeys.lists(params as Record<string, unknown>),
    queryFn: () => fetchReviews(params),
    initialData: isInitialDataValid && initialData ? initialData : undefined,
    staleTime: 0,
  });
}
