"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { homeQueryKeys } from "./query-keys";
import type { CategoriesResponse } from "../schemas/category.schema";

async function fetchCategories(): Promise<CategoriesResponse> {
  const { data } = await api.get<CategoriesResponse>("/categories");
  return data;
}

export function useCategories() {
  return useQuery({
    queryKey: homeQueryKeys.categories.list(),
    queryFn: fetchCategories,
    // Retorna array vazio em caso de erro (endpoint não existe ainda)
    retry: false,
    // Fallback em caso de erro
    placeholderData: [],
  });
}
