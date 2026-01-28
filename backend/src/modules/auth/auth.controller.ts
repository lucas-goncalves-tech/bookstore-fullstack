import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  create = async (req: Request, res: Response) => {
    const userData = req.body as CreateUserDto;

    const result = await this.authService.create(userData);

    res.status(201).json({
      message: `Usuário ${result.name} criado com sucesso!`,
      data: result,
    });
  };
}
