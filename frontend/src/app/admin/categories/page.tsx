"use client"

import { CategoriesTable } from "@/modules/admin/categories/components/categories-table"

export default function AdminCategoriesPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Gerenciar Categorias</h1>
      <CategoriesTable />
    </div>
  )
}
