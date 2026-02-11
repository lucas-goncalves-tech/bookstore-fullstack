import { z } from "zod";

// Schema for creating/editing a book
export const bookFormSchema = z.object({
  title: z.string().min(4, "O título deve ter pelo menos 4 caracteres"),
  author: z.string().min(3, "O autor deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .max(255, "A descrição deve ter no máximo 255 caracteres"),
  price: z.coerce.number().min(0, "O preço deve ser maior ou igual a 0"),
  stock: z.coerce
    .number()
    .int()
    .min(0, "O estoque deve ser maior ou igual a 0"),
  categoryId: z.string().uuid("Selecione uma categoria válida"),
  coverImage: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "A imagem da capa é obrigatória")
    .optional(),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;
