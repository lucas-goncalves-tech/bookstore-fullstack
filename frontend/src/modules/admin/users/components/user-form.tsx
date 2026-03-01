"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUserFormValues,
  UpdateUserFormValues,
  createUserFormSchema,
  updateUserFormSchema,
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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateUser } from "../hooks/use-create-user";
import { useUpdateUser } from "../hooks/use-update-user";
import { AdminUser } from "../schemas/admin-user.schema";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface UserFormProps {
  initialData?: AdminUser;
  onSuccess?: () => void;
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const isEditing = !!initialData;
  const currentSchema = isEditing ? updateUserFormSchema : createUserFormSchema;

  const defaultValues: Partial<CreateUserFormValues | UpdateUserFormValues> = {
    email: initialData?.email || "",
    name: initialData?.name || "",
    role: (initialData?.role as "USER" | "ADMIN") || "USER",
    ...(isEditing ? {} : { password: "", confirmPassword: "" }),
  };

  const form = useForm<CreateUserFormValues | UpdateUserFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(currentSchema) as any,
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        email: initialData.email,
        name: initialData.name,
        role: initialData.role as "USER" | "ADMIN",
      });
    }
  }, [initialData, form]);

  const onSubmit = async (
    data: CreateUserFormValues | UpdateUserFormValues
  ) => {
    try {
      if (initialData) {
        await updateUser.mutateAsync({
          id: initialData.id,
          data: data as UpdateUserFormValues,
        });
      } else {
        await createUser.mutateAsync(data as CreateUserFormValues);
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = createUser.isPending || updateUser.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome Completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="usuario@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perfil</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USER">Usuário (USER)</SelectItem>
                  <SelectItem value="ADMIN">Administrador (ADMIN)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isEditing && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="******" {...field} />
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
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Salvar Alterações" : "Criar Usuário"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
