export const adminUserKeys = {
  all: ["admin", "users"] as const,
  lists: (page: number, limit: number, order?: string, search?: string) =>
    [...adminUserKeys.all, "list", { page, limit, order, search }] as const,
  detail: (id: string) => [...adminUserKeys.all, "detail", id] as const,
} as const;
