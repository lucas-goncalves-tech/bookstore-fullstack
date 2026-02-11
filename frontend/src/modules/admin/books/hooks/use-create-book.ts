import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Book } from "@/modules/home/schemas/book.schema";
import { toast } from "sonner";
import { adminBookKeys } from "./query-keys";
import { homeQueryKeys } from "@/modules/home/hooks/query-keys";
import { BookFormValues } from "../schemas/book-form.schema";

interface CreateBookData {
  message: string;
  data: Book;
}

const createBook = async (data: BookFormValues) => {
  const { coverImage, ...bookData } = data;

  const { data: createdBook } = await api.post<CreateBookData>(
    "/books",
    bookData,
  );

  if (coverImage && coverImage.length > 0) {
    const formData = new FormData();
    formData.append("cover", coverImage[0]);

    const { data: bookWithCover } = await api.post<Book>(
      `/books/${createdBook.data.id}/cover`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return bookWithCover;
  }

  return createdBook;
};

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBookKeys.all });
      queryClient.invalidateQueries({ queryKey: homeQueryKeys.books.all });
      toast.success("Livro criado com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao criar livro.");
    },
  });
}
