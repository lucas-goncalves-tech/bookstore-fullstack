import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { adminUserKeys } from "./query-keys";
import { AdminUser } from "../schemas/admin-user.schema";

interface RestoreUserResponse {
  message: string;
  data: Omit<AdminUser, "id">;
}

const restoreUser = async (id: string) => {
  const { data: restoredUser } = await api.patch<RestoreUserResponse>(
    `/admin/users/${id}/restore`,
  );
  return restoredUser;
};

export function useRestoreUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      toast.success("Usuário desbanido com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao desbanir usuário.");
    },
  });
}
