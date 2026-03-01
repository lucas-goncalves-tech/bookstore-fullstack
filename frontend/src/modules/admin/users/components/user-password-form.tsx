"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateUserPasswordFormValues,
  updateUserPasswordFormSchema,
} from "../schemas/user-form.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { useUpdateUserPassword } from "../hooks/use-update-user-password";
import { AdminUser } from "../schemas/admin-user.schema";
import { Loader2 } from "lucide-react";

interface UserPasswordFormProps {
  user: AdminUser;
  onSuccess?: () => void;
}

export function UserPasswordForm({ user, onSuccess }: UserPasswordFormProps) {
  const updatePassword = useUpdateUserPassword();

  const form = useForm<UpdateUserPasswordFormValues>({
    resolver: zodResolver(updateUserPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: UpdateUserPasswordFormValues) => {
    try {
      await updatePassword.mutateAsync({ id: user.id, data });
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = updatePassword.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Digite a nova senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Nova Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Confirme a nova senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Alterar Senha
          </Button>
        </div>
      </form>
    </Form>
  );
}
