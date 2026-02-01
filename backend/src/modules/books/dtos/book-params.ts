import z from "zod";

export const bookParamsDto = z.strictObject({
  id: z.uuid(),
});

export type BookParamsDto = z.infer<typeof bookParamsDto>;