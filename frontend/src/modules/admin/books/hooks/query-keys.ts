export const adminBookKeys = {
  all: ["admin", "books"] as const,
  lists: (params: Record<string, unknown>) =>
    [...adminBookKeys.all, "list", params] as const,
  detail: (id: string) => [...adminBookKeys.all, "detail", id] as const,
} as const;
