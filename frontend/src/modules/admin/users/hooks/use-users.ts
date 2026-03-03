import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { adminUserKeys } from "./query-keys";
import { AdminUsersResponse } from "../schemas/admin-user.schema";

export type AdminUserQueryParams = {
  page?: number;
  limit?: number;
  order?: string;
  search?: string;
};

const fetchUsers = async (
  params: AdminUserQueryParams = { page: 1, limit: 10 },
): Promise<AdminUsersResponse> => {
  const { data } = await api.get<AdminUsersResponse>("/admin/users", {
    params,
  });
  return data;
};

export function useAdminUsers(
  params: AdminUserQueryParams = { page: 1, limit: 10 },
  initialData?: AdminUsersResponse | null,
) {
  const isInitialDataValid =
    params.page === 1 && !params.order && !params.search;

  return useQuery({
    queryKey: adminUserKeys.lists(params as Record<string, unknown>),
    queryFn: () => fetchUsers(params),
    initialData: isInitialDataValid && initialData ? initialData : undefined,
    staleTime: 0,
  });
}
