export const adminReviewKeys = {
  all: ["adminReviews"] as const,
  lists: (params?: Record<string, unknown>) =>
    [...adminReviewKeys.all, "list", ...(params ? [params] : [])] as const,
  detail: (id: string) => [...adminReviewKeys.all, "detail", id] as const,
};
