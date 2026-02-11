import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { adminBookKeys } from "./query-keys";
import { homeQueryKeys } from "@/modules/home/hooks/query-keys";

// Delete book
const deleteBook = async (id: string): Promise<void> => {
  await api.delete(`/books/${id}`);
};

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminBookKeys.all });
      queryClient.invalidateQueries({ queryKey: homeQueryKeys.books.all });
      queryClient.invalidateQueries({
        queryKey: homeQueryKeys.books.detail(variables),
      });
      toast.success("Livro removido com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao remover livro.");
    },
  });
}
