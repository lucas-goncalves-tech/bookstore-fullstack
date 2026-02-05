import z from "zod";
import { zodCoerceNumber } from "../../../shared/validators/comom.validators";

export const createOrderDto = z
  .array(
    z.strictObject({
      id: z.uuid(),
      quantity: zodCoerceNumber
        .nonnegative()
        .min(1, "Precisa comprar pelo menos 1 livro"),
    }),
  )
  .nonempty();

export type CreateOrderDto = z.infer<typeof createOrderDto>;
