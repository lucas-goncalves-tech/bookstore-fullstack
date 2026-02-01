import z from "zod";

// Schema para categoria (baseado no Prisma schema)
export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

// Schema para lista de categorias
export const categoriesResponseSchema = z.array(categorySchema);

export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;
