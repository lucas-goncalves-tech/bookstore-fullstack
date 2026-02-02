import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { CategoriesResponse } from "@/modules/home/schemas/category.schema";
import { adminCategoryKeys } from "./query-keys";

const fetchCategories = async (): Promise<CategoriesResponse> => {
  const { data } = await api.get<CategoriesResponse>("/categories");
  return data;
};

export function useAdminCategories() {
  return useQuery({
    queryKey: adminCategoryKeys.lists(),
    queryFn: fetchCategories,
  });
}
