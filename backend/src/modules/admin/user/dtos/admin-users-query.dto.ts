import z from "zod";
import { zodCoerceNumber } from "../../../../shared/validators/comom.validators";
import { zodSafeString } from "../../../../shared/validators/string.validator";

export const findManyForAdminQueryDto = z.object({
  page: zodCoerceNumber.int().optional(),
  limit: zodCoerceNumber.int().optional(),
  search: zodSafeString.optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type FindManyForAdminQueryDto = z.infer<typeof findManyForAdminQueryDto>;
