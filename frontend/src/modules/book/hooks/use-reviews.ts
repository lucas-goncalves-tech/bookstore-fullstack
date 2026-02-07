import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { bookQueryKeys } from "./query-keys";
import {
  CreateReviewSchema,
  Review,
  BookReviewsResponse,
} from "../schemas/review.schema";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { z } from "zod";

const reviewSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string(),
  createdAt: z.string(),
  bookId: z.string(),
  user: z.object({
    name: z.string(),
  }),
});

const bookReviewsResponseSchema = z.object({
  reviews: z.array(reviewSchema),
  averageRating: z.number(),
  totalReviews: z.number(),
});

export function useBookReviews(
  bookId: string,
  initialData?: BookReviewsResponse | null,
) {
  return useQuery({
    queryKey: bookQueryKeys.reviews.list(bookId),
    queryFn: async () => {
      const { data } = await api.get<BookReviewsResponse>(
        `/books/${bookId}/reviews`,
      );
      return bookReviewsResponseSchema.parse(data);
    },
    enabled: !!bookId,
    initialData: initialData ?? undefined,
  });
}

export function useCreateReview(bookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReviewSchema) => {
      const { data } = await api.post<Review>(
        `/books/${bookId}/reviews`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookQueryKeys.reviews.list(bookId),
      });
      toast.success("Avaliação enviada com sucesso!");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Erro ao enviar avaliação.",
        );
      } else {
        toast.error("Ocorreu um erro inesperado.");
      }
    },
  });
}
