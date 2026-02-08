import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import {
  SID_ACCESS_COOKIE,
  SID_ACCESS_COOKIE_OPTIONS,
  SID_REFRESH_COOKIE,
  SID_REFRESH_COOKIE_OPTIONS,
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

    const { accessToken, refreshToken } = await this.authService.login(body);
    res.cookie(SID_ACCESS_COOKIE, accessToken, SID_ACCESS_COOKIE_OPTIONS());
    res.cookie(SID_REFRESH_COOKIE, refreshToken, SID_REFRESH_COOKIE_OPTIONS());
    res.status(204).end();
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies[SID_REFRESH_COOKIE];

    const {
      accessToken,
      refreshToken: newRefreshToken,
      expiresMs,
    } = await this.authService.refresh(refreshToken);

    res.cookie(SID_ACCESS_COOKIE, accessToken, SID_ACCESS_COOKIE_OPTIONS());
    res.cookie(
      SID_REFRESH_COOKIE,
      newRefreshToken,
      SID_REFRESH_COOKIE_OPTIONS(expiresMs),
    );
    res.status(204).end();
  };

  logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies[SID_REFRESH_COOKIE];

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    res.clearCookie(SID_ACCESS_COOKIE, SID_ACCESS_COOKIE_OPTIONS());
    res.clearCookie(SID_REFRESH_COOKIE, SID_REFRESH_COOKIE_OPTIONS());
    res.status(204).end();
  };
}
