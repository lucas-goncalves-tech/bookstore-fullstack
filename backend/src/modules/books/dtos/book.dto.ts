import z from "zod";
import { zodSafeString } from "../../../shared/validators/string.validator";
import { zodCoerceNumber } from "../../../shared/validators/comom.validators";
import { Decimal } from "@prisma/client/runtime/library";

export const createBookDto = z.object({
    title: zodSafeString.min(3, "Título precisa ter pelo menos 3 caracteres"),
    author: zodSafeString.min(3, "Autor precisa ter pelo menos 3 caracteres"),
    description: zodSafeString.min(3, "Descrição precisa ter pelo menos 3 caracteres"),
    price: zodCoerceNumber.min(1, "Preço precisa ser maior que 0").transform((value) => new Decimal(value)),
    stock: zodCoerceNumber.min(1, "Estoque precisa ser maior que 0"),
    categoryId: z.uuid().nullable(),
}); 

export const updateBookDto = createBookDto.partial().extend({
    coverUrl: z.string().nullable(),
    coverThumbUrl: z.string().nullable(),
});

export type CreateBookDto = z.infer<typeof createBookDto>;
export type UpdateBookDto = z.infer<typeof updateBookDto>;