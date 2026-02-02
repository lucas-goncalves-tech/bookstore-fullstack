import { z } from "zod";

export const categoryParamsDto = z.object({
  id: z.uuid(),
});

export type CategoryParamsDto = z.infer<typeof categoryParamsDto>;
