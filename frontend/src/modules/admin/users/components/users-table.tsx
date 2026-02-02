"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useAdminUsers, useDeleteUser, useUpdateUserRole } from "../hooks/use-admin-users"
import { Loader2, Trash2 } from "lucide-react"
import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UserRole } from "../schemas/user.schema"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function UsersTable() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { data, isLoading } = useAdminUsers(page, limit)
  const updateRole = useUpdateUserRole()
  const deleteUser = useDeleteUser()

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
      try {
          await updateRole.mutateAsync({ id: userId, role: newRole })
      } catch {
          // Toast handled in hook
      }
  }

  const handleDelete = async (id: string) => {
      try {
          await deleteUser.mutateAsync(id)
      } catch {
           // Toast handled in hook
      }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                    <Select 
                        defaultValue={user.role} 
                        onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                        disabled={updateRole.isPending}
                    >
                        <SelectTrigger className="w-[120px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USER">Usuário</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </TableCell>
                <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                 <TableCell className="text-right">
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação removerá permanentemente o usuário &quot;{user.name}&quot;.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => handleDelete(user.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Excluir
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
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

       {/* Simple Pagination */}
       <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
            Página {page}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={!data?.data || data.data.length < limit}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}
