import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, authApi } from "@/lib/axios";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export function useUser() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["users", "me"],
    queryFn: async () => {
      try {
        const { data } = await api.get<User>("/users/me");
        return data;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: Infinity,
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await authApi.get("/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      toast.success("Logout realizado com sucesso!");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      toast.error("Erro ao realizar logout!");
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
