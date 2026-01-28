import { zodPassword, zodSafeEmail } from "@/validators/zod.validators";
import { z } from "zod";

export const loginSchema = z.object({
  email: zodSafeEmail,
  password: zodPassword(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
