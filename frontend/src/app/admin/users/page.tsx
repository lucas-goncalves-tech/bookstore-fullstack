import { UsersTable } from "@/modules/admin/users/components/users-table";
import { serverGet } from "@/lib/server-fetch";
import { UsersResponse } from "@/modules/admin/users/schemas/user.schema";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const initialData = await serverGet<UsersResponse>(
    "/admin/users?page=1&limit=10",
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Gerenciar Usuários</h1>
      <UsersTable initialData={initialData} />
    </div>
  );
}
