import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Category } from "@/modules/home/schemas/category.schema";
import { toast } from "sonner";
import { adminCategoryKeys } from "./query-keys";
import { homeQueryKeys } from "@/modules/home/hooks/query-keys";

const createCategory = async (data: Partial<Category>): Promise<Category> => {
  const { data: response } = await api.post<Category>("/categories", data);
  return response;
};

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: homeQueryKeys.categories.all });
      toast.success("Categoria criada com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao criar categoria.");
    },
  });
}
