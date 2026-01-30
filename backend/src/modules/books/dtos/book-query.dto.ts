import z from "zod";
import { zodSafeString } from "../../../shared/validators/string.validator";
import { zodCoerceNumber } from "../../../shared/validators/comom.validators";

export const bookQueryDto = z.strictObject({
  search: zodSafeString.optional(),
  limit: zodCoerceNumber.int().optional(),
  page: zodCoerceNumber.int().optional(),
  categoryId: z.uuid().optional(),
  minPrice: zodCoerceNumber.int().optional(),
  maxPrice: zodCoerceNumber.int().optional(),
});

export type BookQueryDTO = z.infer<typeof bookQueryDto>;
