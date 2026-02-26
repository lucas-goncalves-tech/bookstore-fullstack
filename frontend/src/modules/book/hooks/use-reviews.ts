import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
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
      return data;
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

      // Invalida a própria query 'me' para parar o loading e injetar os dados no form
      queryClient.invalidateQueries({
        queryKey: bookQueryKeys.reviews.me(bookId),
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

export function useMyReview(bookId: string) {
  return useQuery({
    queryKey: bookQueryKeys.reviews.me(bookId),
    queryFn: async () => {
      const { data } = await api.get<Review | null>(
        `/books/${bookId}/reviews/me`,
      );
      if (!data) return null;
      return data;
    },
    enabled: !!bookId,
  });
}

export function useDeleteReview(bookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete(`/books/${bookId}/reviews`);
    },
    onSuccess: () => {
      // Invalida a lista de reviews do livro
      queryClient.invalidateQueries({
        queryKey: bookQueryKeys.reviews.list(bookId),
      });

      // Invalida a avaliação do usuário
      queryClient.invalidateQueries({
        queryKey: bookQueryKeys.reviews.me(bookId),
      });

      // Invalida os detalhes do livro
      queryClient.invalidateQueries({
        queryKey: bookQueryKeys.detail(bookId),
      });

      queryClient.invalidateQueries({
        queryKey: homeQueryKeys.books.all,
      });

      toast.success("Avaliação apagada com sucesso!");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Erro ao apagar avaliação.",
        );
      } else {
        toast.error("Ocorreu um erro inesperado.");
      }
    },
  });
}
