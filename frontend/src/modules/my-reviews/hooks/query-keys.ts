export const myReviewsQueryKeys = {
  all: ["my-reviews"] as const,
  list: () => [...myReviewsQueryKeys.all, "list"] as const,
};
