import z from "zod";
import { zodSafeEmail } from "../../../shared/validators/email.validator";
import { zodPassword } from "../../../shared/validators/comom.validators";

export const loginDto = z.strictObject({
  email: zodSafeEmail,
  password: zodPassword(),
});

export type LoginDTO = z.infer<typeof loginDto>;
