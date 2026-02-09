import { CategoriesTable } from "@/modules/admin/categories/components/categories-table";
import { serverGet } from "@/lib/server-fetch";
import type { CategoriesResponse } from "@/modules/home/schemas/category.schema";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const initialData = await serverGet<CategoriesResponse>("/categories");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">
        Gerenciar Categorias
      </h1>
      <CategoriesTable initialData={initialData} />
    </div>
  );
}
