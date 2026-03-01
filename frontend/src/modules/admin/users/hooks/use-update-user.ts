import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { adminUserKeys } from "./query-keys";
import { UpdateUserFormValues } from "../schemas/user-form.schema";
import { AdminUser } from "../schemas/admin-user.schema";

interface UpdateUserResponse {
  message: string;
  data: Omit<AdminUser, "id">;
}

const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateUserFormValues;
}) => {
  const { data: updatedUser } = await api.put<UpdateUserResponse>(
    `/admin/users/${id}`,
    data,
  );
  return updatedUser;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      toast.success("Usuário atualizado com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao atualizar usuário.");
    },
  });
}
