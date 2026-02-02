import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { adminCategoryKeys } from "./query-keys";
import { homeQueryKeys } from "@/modules/home/hooks/query-keys";

const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: homeQueryKeys.categories.all });
      toast.success("Categoria removida com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao remover categoria.");
    },
  });
}
