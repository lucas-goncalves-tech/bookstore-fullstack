import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, resetRefreshState } from "@/lib/axios";
import { LoginFormData } from "../schemas/login.schema";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      await authApi.post("/auth/login", data);
    },
    onSuccess: () => {
      resetRefreshState();
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      toast.success("Login realizado com sucesso");
      router.push("/");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Erro ao realizar login");
      } else {
        toast.error("Ocorreu um erro inesperado");
      }
    },
  });
}
