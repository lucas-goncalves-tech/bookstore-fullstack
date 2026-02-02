import z from "zod";
import {
  zodCoerceNumber,
  zodSafeSlug,
  zodSafeString,
} from "@/validators/zod.validators";

export const bookQuerySchema = z.object({
  search: zodSafeString.optional(),
  limit: zodCoerceNumber.int().optional(),
  page: zodCoerceNumber.int().optional(),
  categorySlug: zodSafeSlug.optional(),
  minPrice: zodCoerceNumber.optional(),
  maxPrice: zodCoerceNumber.optional(),
});

export type BookQueryParams = z.infer<typeof bookQuerySchema>;

export const bookSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  stock: z.number().int(),
  coverUrl: z.string().nullable(),
  coverThumbUrl: z.string().nullable(),
  categoryId: z.uuid().nullable(),
  category: z
    .object({
      name: z.string(),
    })
    .nullable()
    .optional(),
  createdAt: z.coerce.date(),
});

export type Book = z.infer<typeof bookSchema>;

export const booksResponseSchema = z.object({
  data: z.array(bookSchema),
  metadata: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export type BooksResponse = z.infer<typeof booksResponseSchema>;
