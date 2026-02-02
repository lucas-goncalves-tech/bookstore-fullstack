import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Category } from "@/modules/home/schemas/category.schema";
import { toast } from "sonner";
import { adminCategoryKeys } from "./query-keys";
import { homeQueryKeys } from "@/modules/home/hooks/query-keys";

const updateCategory = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Category>;
}): Promise<Category> => {
  const { data: response } = await api.put<Category>(`/categories/${id}`, data);
  return response;
};

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: homeQueryKeys.categories.all });
      toast.success("Categoria atualizada com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao atualizar categoria.");
    },
  });
}
