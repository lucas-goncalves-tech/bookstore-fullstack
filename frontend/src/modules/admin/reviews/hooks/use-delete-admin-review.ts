import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { adminReviewKeys } from "./query-keys";
import { toast } from "sonner";

export function useDeleteAdminReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/reviews/${id}`);
    },
    onSuccess: () => {
      toast.success("Avaliação deletada com sucesso");
      queryClient.invalidateQueries({
        queryKey: adminReviewKeys.lists(),
      });
    },
    onError: (error: unknown) => {
      const e = error as { response?: { data?: { message?: string } } };
      const message =
        e.response?.data?.message ||
        "Ocorreu um erro ao deletar a avaliação";
      toast.error(message);
    },
  });
}
