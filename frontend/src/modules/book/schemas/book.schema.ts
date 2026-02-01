import z from "zod";

// Schema para resposta de livro individual do backend
export const bookDetailSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  stock: z.number().int(),
  coverUrl: z.string().nullable(),
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

export type BookDetail = z.infer<typeof bookDetailSchema>;
