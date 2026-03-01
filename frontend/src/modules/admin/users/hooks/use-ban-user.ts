import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { adminUserKeys } from "./query-keys";
import { BanUserFormValues } from "../schemas/user-form.schema";
import { AdminUser } from "../schemas/admin-user.schema";

interface BanUserResponse {
  message: string;
  data: Omit<AdminUser, "id">;
}

const banUser = async ({
  id,
  data,
}: {
  id: string;
  data: BanUserFormValues;
}) => {
  const { data: bannedUser } = await api.delete<BanUserResponse>(
    `/admin/users/${id}`,
    { data },
  );
  return bannedUser;
};

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: banUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      toast.success("Usuário banido com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao banir usuário.");
    },
  });
}
