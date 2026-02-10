import z from "zod";
import { zodCoerceNumber } from "../../../shared/validators/comom.validators";

export const dashboardQueryDto = z.strictObject({
  page: zodCoerceNumber.default(1),
});

export type DashBoardQueryDto = z.infer<typeof dashboardQueryDto>;
