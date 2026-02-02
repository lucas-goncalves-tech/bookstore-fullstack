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
    retry: false,
  });
}
