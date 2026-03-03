"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useAdminUsers } from "../hooks/use-users";
import { useRestoreUser } from "../hooks/use-restore-user";
import { usePermanentDeleteUser } from "../hooks/use-permanent-delete-user";
import { AdminUser, AdminUsersResponse } from "../schemas/admin-user.schema";
import {
  Edit,
  MoreHorizontal,
  Ban,
  RefreshCcw,
  KeyRound,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { SimplePagination } from "@/components/simple-pagination";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useSearchParams, useRouter } from "next/navigation";

interface UsersTableProps {
  onEdit: (user: AdminUser) => void;
  onChangePassword: (user: AdminUser) => void;
  onBan: (user: AdminUser) => void;
  initialData?: AdminUsersResponse | null;
}

export function UsersTable({
  onEdit,
  onChangePassword,
  onBan,
  initialData,
}: UsersTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || undefined;
  const order = searchParams.get("order") || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const params = useMemo(() => ({
    search,
    order,
    page,
    limit,
  }), [search, order, page, limit]);

  const { data, isLoading } = useAdminUsers(params, initialData);

  const restoreUser = useRestoreUser();
  const permanentDeleteUser = usePermanentDeleteUser();

  const [userToRestore, setUserToRestore] = useState<AdminUser | null>(null);
  const [userToPermanentDelete, setUserToPermanentDelete] =
    useState<AdminUser | null>(null);

  const totalPages = data?.metadata?.totalPages || 1;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell
                  className="font-medium max-w-[200px] truncate"
                  title={user.name}
                >
                  {user.name}
                </TableCell>
                <TableCell
                  className="max-w-[200px] truncate"
                  title={user.email}
                >
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.bannedAt ? "destructive" : "outline"}
                  >
                    {user.bannedAt ? "Banido" : "Ativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onChangePassword(user)}>
                        <KeyRound className="mr-2 h-4 w-4" />
                        Trocar Senha
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Disable Desbanir if not banned */}
                      {user.bannedAt ? (
                        <DropdownMenuItem onClick={() => setUserToRestore(user)}>
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Desbanir
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onBan(user)}>
                          <Ban className="mr-2 h-4 w-4" />
                          Banir
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setUserToPermanentDelete(user)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar Permanentemente
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {(!data?.data || data.data.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Restore User AlertDialog */}
      <AlertDialog
        open={!!userToRestore}
        onOpenChange={(open) => !open && setUserToRestore(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desbanir Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desbanir o usuário &quot;
              {userToRestore?.name}&quot;? Ele recuperará o acesso ao sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!userToRestore) return;
                try {
                  await restoreUser.mutateAsync(userToRestore.id);
                  setUserToRestore(null);
                } catch (error) {
                  console.error(error);
                }
              }}
              disabled={restoreUser.isPending}
            >
              {restoreUser.isPending ? "Desbanindo..." : "Desbanir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete User AlertDialog */}
      <AlertDialog
        open={!!userToPermanentDelete}
        onOpenChange={(open) => !open && setUserToPermanentDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Usuário Permanentemente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O usuário &quot;
              {userToPermanentDelete?.name}&quot; será apagado em definitivo do
              banco de dados, juntamente com todas as suas informações de login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!userToPermanentDelete) return;
                try {
                  await permanentDeleteUser.mutateAsync(userToPermanentDelete.id);
                  setUserToPermanentDelete(null);
                } catch (error) {
                  console.error(error);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={permanentDeleteUser.isPending}
            >
              {permanentDeleteUser.isPending ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SimplePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          const newParams = new URLSearchParams(searchParams.toString());
          if (newPage === 1) newParams.delete("page");
          else newParams.set("page", String(newPage));
          router.push(`?${newParams.toString()}`, { scroll: false });
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
