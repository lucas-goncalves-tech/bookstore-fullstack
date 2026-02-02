export const adminCategoryKeys = {
  all: ["admin", "categories"] as const,
  lists: () => [...adminCategoryKeys.all, "list"] as const,
  detail: (id: string) => [...adminCategoryKeys.all, "detail", id] as const,
} as const;
