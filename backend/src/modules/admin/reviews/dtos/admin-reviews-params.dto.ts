import { z } from "zod";

export const adminReviewParamsDto = z.object({
  id: z.uuid("ID inválido"),
});

export type AdminReviewParamsDto = z.infer<typeof adminReviewParamsDto>;
