import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import {
  SID_COOKIE,
  SID_COOKIE_OPTIONS,
} from "../../shared/contants/sid-cookie";
import { LoginDTO } from "./dto/login.dto";

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

  login = async (req: Request, res: Response) => {
    const body = req.body as LoginDTO;

    const token = await this.authService.login(body);
    res.cookie(SID_COOKIE, token, SID_COOKIE_OPTIONS());
    res.status(204).end();
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie(SID_COOKIE, SID_COOKIE_OPTIONS());
    res.status(204).end();
  };
}
