import z from "zod";
import { zodSafeString } from "../../../shared/validators/string.validator";
import { zodCoerceNumber } from "../../../shared/validators/comom.validators";
import { Decimal } from "@prisma/client/runtime/library";

export const createBookDto = z.object({
  title: zodSafeString.min(3, "Título precisa ter pelo menos 3 caracteres"),
  author: zodSafeString.min(3, "Autor precisa ter pelo menos 3 caracteres"),
  description: zodSafeString.min(
    3,
    "Descrição precisa ter pelo menos 3 caracteres",
  ),
  price: zodCoerceNumber
    .min(1, "Preço precisa ser maior que 0")
    .transform((value) => new Decimal(value)),
  stock: zodCoerceNumber.min(1, "Estoque precisa ser maior que 0"),
  categoryId: z.uuid().nullable(),
});

export const updateBookDto = createBookDto.partial().extend({
  coverUrl: z.string().optional(),
  coverThumbUrl: z.string().optional(),
});

export type CreateBookDto = z.infer<typeof createBookDto>;
export type UpdateBookDto = z.infer<typeof updateBookDto>;

export const findBookByIdResponse = z.object({
  id: z.uuid(),
  author: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.string(),
  stock: z.number(),
  coverUrl: z.string().nullable(),
  coverThumbUrl: z.string().nullable(),
  categoryId: z.uuid().nullable(),
  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

const booksData = z.array(
  findBookByIdResponse.extend({
    averageRating: z.number(),
    category: z.object({
      name: z.string().nullable(),
    }),
  }),
);

const bookMetadata = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const findManyBooksReponse = z.object({
  data: booksData,
  metadata: bookMetadata,
});

export const createBookResponse = z.object({
  message: z.string(),
  data: findBookByIdResponse,
});

export const uploadBookCoverResponse = z.object({
  message: z.string(),
  data: z.object({
    coverUrl: z.string(),
    coverThumbUrl: z.string(),
  }),
});

export const updateBookResponse = z.object({
  message: z.string(),
  data: findBookByIdResponse,
});
