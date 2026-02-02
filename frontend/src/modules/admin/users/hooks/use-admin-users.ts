"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { User, UsersResponse, UserRole } from "../schemas/user.schema";
import { toast } from "sonner";

// Fetch users with pagination
const fetchUsers = async (page = 1, limit = 10): Promise<UsersResponse> => {
  const { data } = await api.get<UsersResponse>("/admin/users", {
    params: { page, limit },
  });
  return data;
};

// Update user role
const updateUserRole = async ({
  id,
  role,
}: {
  id: string;
  role: UserRole;
}): Promise<User> => {
  const { data } = await api.patch<User>(`/admin/users/${id}/role`, { role });
  return data;
};

// Delete user (optional, valid for implementation)
const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};

export function useAdminUsers(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["admin", "users", page, limit],
    queryFn: () => fetchUsers(page, limit),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Permissão do usuário atualizada com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao atualizar permissão.");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Usuário removido com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao remover usuário.");
    },
  });
}
