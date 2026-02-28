import { z } from "zod";

export const adminUserParamsDto = z.object({
  id: z.string().uuid(),
});

export type AdminUserParamsDto = z.infer<typeof adminUserParamsDto>;
