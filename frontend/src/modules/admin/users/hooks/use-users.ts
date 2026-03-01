import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { adminUserKeys } from "./query-keys";
import { AdminUsersResponse } from "../schemas/admin-user.schema";

const fetchUsers = async (
  page = 1,
  limit = 10,
  order?: string,
  search?: string,
): Promise<AdminUsersResponse> => {
  const { data } = await api.get<AdminUsersResponse>("/admin/users", {
    params: { page, limit, order, search },
  });
  return data;
};

export function useAdminUsers(
  page = 1,
  limit = 10,
  order?: string,
  search?: string,
  initialData?: AdminUsersResponse | null,
) {
  return useQuery({
    queryKey: adminUserKeys.lists(page, limit, order, search),
    queryFn: () => fetchUsers(page, limit, order, search),
    initialData:
      page === 1 && !order && !search && initialData ? initialData : undefined,
    staleTime: 0,
  });
}
