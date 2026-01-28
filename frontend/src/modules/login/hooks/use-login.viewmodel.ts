"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "../schemas/login.schema";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export function useLoginViewModel() {
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      await api.post(
        process.env.NEXT_PUBLIC_API_URL + "/api/v1/auth/login",
        data,
      );
    },
    onSuccess: () => {
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

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await mutateAsync(data);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}
