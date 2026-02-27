import { z } from "zod";
import { zodCoerceNumber } from "../../../../shared/validators/comom.validators";
import { zodSafeString } from "../../../../shared/validators/string.validator";

export const findManyForAdminQueryDto = z.object({
  page: zodCoerceNumber.int().optional(),
  limit: zodCoerceNumber.int().optional(),
  search: zodSafeString.optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type FindManyForAdminQueryDto = z.infer<typeof findManyForAdminQueryDto>;

export const userResponse = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  banReason: z.string().nullable(),
  bannedAt: z.date().nullable(),
});

export const metadataResponse = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const findManyUserForAdminResponse = z.object({
  data: z.array(userResponse),
  metadata: metadataResponse,
});
