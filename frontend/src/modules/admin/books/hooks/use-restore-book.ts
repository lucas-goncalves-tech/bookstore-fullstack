import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { adminBookKeys } from "./query-keys";
import { homeQueryKeys } from "@/modules/home/hooks/query-keys";

// Restore book
const restoreBook = async (id: string): Promise<void> => {
  await api.patch(`/admin/books/${id}/restore`);
};

export function useRestoreBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreBook,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminBookKeys.all });
      queryClient.invalidateQueries({ queryKey: homeQueryKeys.books.all });
      queryClient.invalidateQueries({
        queryKey: homeQueryKeys.books.detail(variables),
      });
      toast.success("Livro restaurado com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao restaurar livro.");
    },
  });
}
