import z from "zod";

export const categorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

export const categoriesResponseSchema = z.array(categorySchema);

export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;
