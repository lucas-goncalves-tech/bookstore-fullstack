import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { UpdateUserPasswordFormValues } from "../schemas/user-form.schema";

const updatePassword = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateUserPasswordFormValues;
}) => {
  await api.patch(`/admin/users/${id}/password`, data);
};

export function useUpdateUserPassword() {
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success("Senha atualizada com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao atualizar senha.");
    },
  });
}
