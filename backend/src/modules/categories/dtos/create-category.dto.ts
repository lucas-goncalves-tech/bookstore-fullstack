import z from "zod";
import { zodSafeString } from "../../../shared/validators/string.validator";
import { zodSafeSlug } from "../../../shared/validators/comom.validators";

export const createCategoryDto = z.strictObject({
  name: zodSafeString.min(3, "O nome deve ter pelo menos 3 caracteres"),
  slug: zodSafeSlug.min(3, "O slug deve ter pelo menos 3 caracteres"),
  description: zodSafeString.min(
    3,
    "A descrição deve ter pelo menos 3 caracteres",
  ),
});

export type CreateCategoryDto = z.infer<typeof createCategoryDto>;
