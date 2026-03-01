import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { adminUserKeys } from "./query-keys";

const permanentDeleteUser = async (id: string) => {
  await api.delete(`/admin/users/${id}/permanent`);
};

export function usePermanentDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentDeleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      toast.success("Usuário deletado permanentemente!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao deletar usuário permanentemente.");
    },
  });
}
