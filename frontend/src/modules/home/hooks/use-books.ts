"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { homeQueryKeys } from "./query-keys";
import type { BookQueryParams, BooksResponse } from "../schemas/book.schema";

async function fetchBooks(params?: BookQueryParams): Promise<BooksResponse> {
  const { data } = await api.get<BooksResponse>("/books", { params });
  return data;
}

interface UseBooksOptions {
  params?: BookQueryParams;
  initialData?: BooksResponse | null;
}

export function useBooks({ params, initialData }: UseBooksOptions = {}) {
  return useQuery({
    queryKey: homeQueryKeys.books.list(params),
    queryFn: () => fetchBooks(params),
    initialData: initialData ?? undefined,
  });
}

