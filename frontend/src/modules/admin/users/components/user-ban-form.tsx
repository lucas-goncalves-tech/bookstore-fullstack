"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BanUserFormValues,
  banUserFormSchema,
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
import { Textarea } from "@/components/ui/textarea";
import { useBanUser } from "../hooks/use-ban-user";
import { AdminUser } from "../schemas/admin-user.schema";
import { Loader2, Ban } from "lucide-react";

interface UserBanFormProps {
  user: AdminUser;
  onSuccess?: () => void;
}

export function UserBanForm({ user, onSuccess }: UserBanFormProps) {
  const banUser = useBanUser();

  const form = useForm<BanUserFormValues>({
    resolver: zodResolver(banUserFormSchema),
    defaultValues: {
      banReason: "",
    },
  });

  const onSubmit = async (data: BanUserFormValues) => {
    try {
      await banUser.mutateAsync({ id: user.id, data });
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = banUser.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="banReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo do Banimento</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explique o motivo do banimento para registro interno."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="submit"
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Ban className="mr-2 h-4 w-4" />
            )}
            Confirmar Banimento
          </Button>
        </div>
      </form>
    </Form>
  );
}
