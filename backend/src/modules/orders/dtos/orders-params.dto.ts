import z from "zod";

export const orderParamsDto = z.object({
  id: z.uuid(),
});

export type OrderParamsDto = z.infer<typeof orderParamsDto>;
