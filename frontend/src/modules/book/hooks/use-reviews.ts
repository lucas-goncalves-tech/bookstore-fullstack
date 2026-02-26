import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { bookQueryKeys } from "./query-keys";
import { homeQueryKeys } from "@/modules/home/hooks/query-keys";
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
  metadata: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export function useBookReviews(
  bookId: string,
  initialData?: BookReviewsResponse | null,
  limit: number = 10,
) {
  return useInfiniteQuery({
    queryKey: [...bookQueryKeys.reviews.list(bookId), limit],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<BookReviewsResponse>(
        `/books/${bookId}/reviews`,
        { params: { page: pageParam, limit } },
      );
      return bookReviewsResponseSchema.parse(data);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.metadata.page < lastPage.metadata.totalPages) {
        return lastPage.metadata.page + 1;
      }
      return undefined;
    },
    enabled: !!bookId,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [1],
        }
      : undefined,
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
      // Invalida a lista de reviews do livro
      queryClient.invalidateQueries({
        queryKey: bookQueryKeys.reviews.list(bookId),
      });

      // Invalida os detalhes do livro (para atualizar o rating médio)
      queryClient.invalidateQueries({
        queryKey: bookQueryKeys.detail(bookId),
      });

      // Invalida a lista de livros da home (para atualizar o rating nos cards)
      queryClient.invalidateQueries({
        queryKey: homeQueryKeys.books.all,
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
