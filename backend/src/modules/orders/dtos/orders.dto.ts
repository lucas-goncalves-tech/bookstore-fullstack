import z from "zod";
import { zodCoerceNumber } from "../../../shared/validators/comom.validators";

export const createOrderDto = z.array(
  z.strictObject({
    id: z.uuid(),
    quantitty: zodCoerceNumber
      .nonnegative()
      .min(1, "Precisa comprar pelo menos 1 livro"),
  }),
);

export type CreateOrderDto = z.infer<typeof createOrderDto>;
