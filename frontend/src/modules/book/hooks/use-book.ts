"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { bookQueryKeys } from "./query-keys";
import type { BookDetail } from "../schemas/book.schema";

async function fetchBook(id: string): Promise<BookDetail> {
  const { data } = await api.get<BookDetail>(`/books/${id}`);
  return data;
}

interface UseBookOptions {
  id: string;
  initialData?: BookDetail | null;
}

export function useBook({ id, initialData }: UseBookOptions) {
  return useQuery({
    queryKey: bookQueryKeys.detail(id),
    queryFn: () => fetchBook(id),
    initialData: initialData ?? undefined,
  });
}
