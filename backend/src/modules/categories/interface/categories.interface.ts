import { Category } from "@prisma/client";

export type ICreateCategoryInput = Omit<Category, "id">;
