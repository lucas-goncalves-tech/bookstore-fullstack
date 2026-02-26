import z from "zod";
import { zodSafeString } from "../../../shared/validators/string.validator";
import {
  zodCoerceNumber,
  zodSafeSlug,
} from "../../../shared/validators/comom.validators";

export const bookQueryDto = z.strictObject({
  search: zodSafeString.optional(),
  limit: zodCoerceNumber.int().optional(),
  page: zodCoerceNumber.int().optional(),
  categorySlug: zodSafeSlug.optional(),
  minPrice: zodCoerceNumber.int().optional(),
  maxPrice: zodCoerceNumber.int().optional(),
});

export const bookReviewsQueryDto = z.object({
  page: zodCoerceNumber.int().optional(),
  limit: zodCoerceNumber.int().optional(),
});

export type BookQueryDTO = z.infer<typeof bookQueryDto>;
export type BookReviewsQueryDTO = z.infer<typeof bookReviewsQueryDto>;
