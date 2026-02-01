import z from "zod";
import { zodSafeString } from "@/validators/zod.validators";

// Schema para query de livros (baseado no backend bookQueryDto)
export const bookQuerySchema = z.object({
  search: zodSafeString.optional(),
  limit: z.coerce.number().int().optional(),
  page: z.coerce.number().int().optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

export type BookQueryParams = z.infer<typeof bookQuerySchema>;

// Schema para resposta de livro do backend (baseado no Prisma schema)
export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  stock: z.number().int(),
  coverUrl: z.string().nullable(),
  coverThumbUrl: z.string().nullable(),
  categoryId: z.string().uuid().nullable(),
  category: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
    })
    .nullable()
    .optional(),
  createdAt: z.coerce.date(),
});

export type Book = z.infer<typeof bookSchema>;

// Schema para lista de livros com paginação
export const booksResponseSchema = z.object({
  data: z.array(bookSchema),
  meta: z
    .object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    })
    .optional(),
});

export type BooksResponse = z.infer<typeof booksResponseSchema>;
