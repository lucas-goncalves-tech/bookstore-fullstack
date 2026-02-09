import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { BooksResponse } from "@/modules/home/schemas/book.schema";
import { adminBookKeys } from "./query-keys";

// Fetch books with pagination
const fetchBooks = async (page = 1, limit = 10): Promise<BooksResponse> => {
  const { data } = await api.get<BooksResponse>("/books", {
    params: { page, limit },
  });
  return data;
};

export function useAdminBooks(
  page = 1,
  limit = 10,
  initialData?: BooksResponse | null,
) {
  return useQuery({
    queryKey: adminBookKeys.lists(page, limit),
    queryFn: () => fetchBooks(page, limit),
    initialData: page === 1 && initialData ? initialData : undefined,
    staleTime: 0,
  });
}
