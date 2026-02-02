import { zodSafeSlug, zodSafeString } from "@/validators/zod.validators";
import z from "zod";

export const categoryFormSchema = z.object({
  name: zodSafeString.min(4, "O nome deve conter no mínimo 4 caracteres"),
  slug: zodSafeSlug.min(4, "O slug deve conter no mínimo 4 caracteres"),
  description: zodSafeString.min(
    15,
    "A descrição deve conter no mínimo 15 caracteres",
  ),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
