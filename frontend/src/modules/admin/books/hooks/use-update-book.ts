import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Book } from "@/modules/home/schemas/book.schema";
import { toast } from "sonner";
import { adminBookKeys } from "./query-keys";
import { homeQueryKeys } from "@/modules/home/hooks/query-keys";
import { BookFormValues } from "../schemas/book-form.schema";

// Update book
const updateBook = async ({
  id,
  data,
}: {
  id: string;
  data: BookFormValues;
}): Promise<Book> => {
  const { coverImage, ...bookData } = data;

  // 1. Update book details
  const { data: updatedBook } = await api.put<Book>(`/books/${id}`, bookData);

  // 2. Upload new cover if provided
  if (coverImage && coverImage.length > 0) {
    const formData = new FormData();
    formData.append("cover", coverImage[0]);

    const { data: bookWithCover } = await api.post<Book>(
      `/books/${id}/cover`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return bookWithCover;
  }

  return updatedBook;
};

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBookKeys.all });
      queryClient.invalidateQueries({ queryKey: homeQueryKeys.books.all });
      toast.success("Livro atualizado com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao atualizar livro.");
    },
  });
}
