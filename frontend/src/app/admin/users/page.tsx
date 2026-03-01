import { AdminUsersClient } from "@/modules/admin/users/components/admin-users-client";
import { serverGet } from "@/lib/server-fetch";
import { AdminUsersResponse } from "@/modules/admin/users/schemas/admin-user.schema";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const initialData = await serverGet<AdminUsersResponse>(
    "/admin/users?page=1&limit=10"
  );

  return <AdminUsersClient initialData={initialData} />;
}
