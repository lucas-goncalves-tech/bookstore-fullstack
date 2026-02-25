import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/axios";
import { RegisterFormData } from "../schemas/register.schema";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      await authApi.post("/auth/register", data);
    },
    onSuccess: () => {
      toast.success("Conta criada com sucesso!");
      router.push("/auth");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Erro ao criar conta");
      } else {
        toast.error("Ocorreu um erro inesperado");
      }
    },
  });
}
