import { inject, injectable } from "tsyringe";
import { UsersService } from "./users.service";
import { Request, Response } from "express";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  me = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("Usuário não autenticado");
    }

    const result = await this.usersService.me(user.sid);

    return res.status(200).json(result);
  };
}
