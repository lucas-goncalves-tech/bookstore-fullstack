import { inject, injectable } from "tsyringe";
import { AdminUsersService } from "./admin-users.service";
import { Request, Response } from "express";
import { FindManyForAdminQueryDto } from "./dtos/admin-users-query.dto";
import {
  AdminCreateUserDto,
  AdminBanUserDto,
  AdminUpdateUserDto,
  AdminUpdateUserPasswordDto,
} from "./dtos/admin-users.dto";
import { AdminUserParamsDto } from "./dtos/admin-users-params.dto";
import { UnauthorizedError } from "../../../shared/errors/unauthorized.error";

@injectable()
export class AdminUsersController {
  constructor(
    @inject(AdminUsersService)
    private readonly adminUsersService: AdminUsersService,
  ) {}

  findMany = async (req: Request, res: Response) => {
    const query = req.safeQuery as FindManyForAdminQueryDto;
    const result = await this.adminUsersService.findMany(query);
    res.json(result);
  };

  create = async (req: Request, res: Response) => {
    const body = req.safeBody as AdminCreateUserDto;
    const result = await this.adminUsersService.create(body);
    res.status(201).json({
      message: `Usuário ${result.name} criado com sucesso`,
      data: result,
    });
  };

  update = async (req: Request, res: Response) => {
    const adminId = req.user?.sub;
    if (!adminId) throw new UnauthorizedError("Usuário não autenticado");
    const { id } = req.safeParams as AdminUserParamsDto;
    const body = req.safeBody as AdminUpdateUserDto;
    const result = await this.adminUsersService.update(adminId, id, body);
    res.json({
      message: `Usuário ${result.name} atualizado com sucesso`,
      data: result,
    });
  };

  updatePassword = async (req: Request, res: Response) => {
    const { id } = req.safeParams as AdminUserParamsDto;
    const body = req.safeBody as AdminUpdateUserPasswordDto;
    await this.adminUsersService.updatePassword(id, body);
    res.status(204).end();
  };

  restore = async (req: Request, res: Response) => {
    const { id } = req.safeParams as AdminUserParamsDto;
    const result = await this.adminUsersService.restore(id);
    res.json({
      message: `Usuário ${result.name} desbanido com sucesso`,
      data: result,
    });
  };

  ban = async (req: Request, res: Response) => {
    const adminId = req.user?.sub;
    if (!adminId) throw new UnauthorizedError("Usuário não autenticado");
    const { id } = req.safeParams as AdminUserParamsDto;
    const { banReason } = req.safeBody as AdminBanUserDto;
    const result = await this.adminUsersService.ban(adminId, id, banReason);
    res.json({
      message: `Usuário ${result.name} banido com sucesso`,
      data: result,
    });
  };

  delete = async (req: Request, res: Response) => {
    const adminId = req.user?.sub;
    if (!adminId) throw new UnauthorizedError("Usuário não autenticado");
    const { id } = req.safeParams as AdminUserParamsDto;
    await this.adminUsersService.delete(adminId, id);
    res.status(204).end();
  };
}
