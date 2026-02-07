import z from "zod";
import { zodCoerceNumber } from "../../../shared/validators/comom.validators";
import { zodSafeString } from "../../../shared/validators/string.validator";

export const createReviewDto = z.strictObject({
  rating: zodCoerceNumber
    .min(1, "Rating deve ser maior ou igual a 1")
    .max(5, "Rating deve ser menor ou igual a 5"),
  comment: zodSafeString
    .min(1, "Comentário deve ter pelo menos 1 caractere")
    .max(1000, "Comentário deve ter no máximo 1000 caracteres"),
});

export type CreateReviewDto = z.infer<typeof createReviewDto>;
