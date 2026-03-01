import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { adminUserKeys } from "./query-keys";
import { CreateUserFormValues } from "../schemas/user-form.schema";
import { AdminUser } from "../schemas/admin-user.schema";

interface CreateUserResponse {
  message: string;
  data: Omit<AdminUser, "id">;
}

const createUser = async (data: CreateUserFormValues) => {
  const { data: createdUser } = await api.post<CreateUserResponse>(
    "/admin/users",
    data,
  );
  return createdUser;
};

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      toast.success("Usuário criado com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao criar usuário.");
    },
  });
}
