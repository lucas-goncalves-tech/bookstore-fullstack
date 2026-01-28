"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/ui/error-message";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLoginViewModel } from "../hooks/use-login.viewmodel";

export function LoginForm() {
  const { form, onSubmit, isLoading } = useLoginViewModel();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Email Field */}
      <div className="flex flex-col gap-2">
        <label
          className="text-[#4b3d33] dark:text-gray-200 text-sm font-semibold font-display"
          htmlFor="email"
        >
          Email
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

      {/* Password Field */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label
            className="text-[#4b3d33] dark:text-gray-200 text-sm font-semibold font-display"
            htmlFor="password"
          >
            Senha
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-semibold text-[#a77d52] hover:text-[#8e6a45] transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>
        <Input
          {...register("password")}
          id="password"
          type="password"
          placeholder="••••••••"
          className={
            errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
          }
        />
        <ErrorMessage message={errors.password?.message} />
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full h-12 bg-[#a77d52] hover:bg-[#8e6a45] text-white font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          <>
            <span>Entrar</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </Button>

      {/* Footer Link */}
      <div className="text-center pt-2">
        <p className="text-sm text-[#4b3d33]/80 dark:text-gray-400">
          Ainda não tem uma conta?{" "}
          <Link
            href="/auth/register"
            className="font-bold text-[#a77d52] hover:text-[#8e6a45] hover:underline transition-colors"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </form>
  );
}
