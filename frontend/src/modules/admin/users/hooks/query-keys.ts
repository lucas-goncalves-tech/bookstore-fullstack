export const adminUserKeys = {
  all: ["admin", "users"] as const,
  lists: (params: Record<string, unknown>) =>
    [...adminUserKeys.all, "list", params] as const,
  detail: (id: string) => [...adminUserKeys.all, "detail", id] as const,
} as const;
