"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  RegisterFormData,
  registerResponseSchema,
  registerSchema,
} from "../schemas/register.schema";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useRegisterViewModel() {
  const { mutateAsync } = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await api.post(
        process.env.NEXT_PUBLIC_API_URL + "/api/v1/auth/register",
        data,
      );
      return registerResponseSchema.parse(response.data);
    },
    onSuccess: (result) => {
      toast.success(result.message);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    },
  });
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Register data:", data);
    await mutateAsync(data);
    form.reset();
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}
