"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRegisterViewModel } from "../hooks/use-register.view-model";
import { ErrorMessage } from "@/components/ui/error-message";

export function RegisterForm() {
  const { form, onSubmit, isLoading } = useRegisterViewModel();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-6 mt-8">
      {/* Name Input */}
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-[#4b3d33] dark:text-gray-300"
          htmlFor="name"
        >
          Nome Completo
        </label>
        <Input
          {...register("name")}
          id="name"
          placeholder="Digite seu nome completo"
          className={
            errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
          }
        />
        <ErrorMessage message={errors.name?.message} />
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-[#4b3d33] dark:text-gray-300"
          htmlFor="email"
        >
          Endereço de Email
        </label>
        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder="nome@exemplo.com"
          className={
            errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
          }
        />
        <ErrorMessage message={errors.email?.message} />
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-[#4b3d33] dark:text-gray-300"
          htmlFor="password"
        >
          Senha
        </label>
        <Input
          {...register("password")}
          id="password"
          type="password"
          placeholder="Crie uma senha"
          className={
            errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
          }
        />
        <ErrorMessage message={errors.password?.message} />
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-[#4b3d33] dark:text-gray-300"
          htmlFor="confirmPassword"
        >
          Confirmar Senha
        </label>
        <Input
          {...register("confirmPassword")}
          id="confirmPassword"
          type="password"
          placeholder="Confirme sua senha"
          className={
            errors.confirmPassword
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }
        />
        <ErrorMessage message={errors.confirmPassword?.message} />
      </div>

      {/* Primary Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#a77d52] hover:bg-[#8e6a45] text-white font-bold py-6 rounded-lg transition-all duration-200 shadow-sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando conta...
          </>
        ) : (
          "Criar Conta"
        )}
      </Button>

      {/* Footer Link */}
      <div className="text-center pt-2">
        <p className="text-sm text-[#4b3d33]/80 dark:text-gray-400">
          Já é um membro?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-[#a77d52] hover:text-[#8e6a45] hover:underline transition-colors"
          >
            Entrar
          </Link>
        </p>
      </div>
    </form>
  );
}
