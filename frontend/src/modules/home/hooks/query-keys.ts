import type { BookQueryParams } from "../schemas/book.schema";

/**
 * Query keys helper para TanStack Query (SST pattern)
 * Centraliza todas as chaves de query do módulo home
 */
export const homeQueryKeys = {
  all: ["home"] as const,

  books: {
    all: ["home", "books"] as const,
    list: (params?: BookQueryParams) =>
      ["home", "books", "list", params ?? {}] as const,
    detail: (id: string) => ["home", "books", "detail", id] as const,
  },

  categories: {
    all: ["home", "categories"] as const,
    list: () => ["home", "categories", "list"] as const,
  },
} as const;
