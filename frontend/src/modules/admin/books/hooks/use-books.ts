import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { BooksResponse } from "@/modules/home/schemas/book.schema";
import { adminBookKeys } from "./query-keys";

export type AdminBookQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
};

// Fetch books with pagination
const fetchBooks = async (
  params: AdminBookQueryParams = { page: 1, limit: 10 },
): Promise<BooksResponse> => {
  const { data } = await api.get<BooksResponse>("/admin/books", { params });
  return data;
};

export function useAdminBooks(
  params: AdminBookQueryParams = { page: 1, limit: 10 },
  initialData?: BooksResponse | null,
) {
  const isInitialDataValid =
    params.page === 1 &&
    !params.search &&
    !params.categorySlug &&
    !params.minPrice &&
    !params.maxPrice;
  return useQuery({
    queryKey: adminBookKeys.lists(params),
    queryFn: () => fetchBooks(params),
    initialData: isInitialDataValid && initialData ? initialData : undefined,
    staleTime: 0,
  });
}
