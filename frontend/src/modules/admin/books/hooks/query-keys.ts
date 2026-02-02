export const adminBookKeys = {
  all: ["admin", "books"] as const,
  lists: (page: number, limit: number) =>
    [...adminBookKeys.all, "list", { page, limit }] as const,
  detail: (id: string) => [...adminBookKeys.all, "detail", id] as const,
} as const;
