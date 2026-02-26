/**
 * Query keys helper para TanStack Query (SST pattern)
 * Centraliza todas as chaves de query do módulo book
 */
export const bookQueryKeys = {
  all: ["book"] as const,

  detail: (id: string) => ["book", "detail", id] as const,

  reviews: {
    all: ["book", "reviews"] as const,
    list: (bookId: string) => ["book", "reviews", "list", bookId] as const,
    me: (bookId: string) => ["book", "reviews", "me", bookId] as const,
  },
} as const;
