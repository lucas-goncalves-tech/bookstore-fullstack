"use client"

import { UsersTable } from "@/modules/admin/users/components/users-table"

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Gerenciar Usuários</h1>
      <UsersTable />
    </div>
  )
}
