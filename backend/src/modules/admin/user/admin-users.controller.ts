import { inject, injectable } from "tsyringe";
import { AdminUsersService } from "./admin-users.service";
import { Request, Response } from "express";
import { FindManyForAdminQueryDto } from "./dtos/admin-users-query.dto";
import {
  AdminCreateUserDto,
  AdminDeleteUserDto,
  AdminUpdateUserDto,
} from "./dtos/admin-users.dto";
import { AdminUserParamsDto } from "./dtos/admin-users-params.dto";

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
    const { id } = req.safeParams as AdminUserParamsDto;
    const body = req.safeBody as AdminUpdateUserDto;
    const result = await this.adminUsersService.update(id, body);
    res.json({
      message: `Usuário ${result.name} atualizado com sucesso`,
      data: result,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.safeParams as AdminUserParamsDto;
    const { banReason } = req.safeBody as AdminDeleteUserDto;
    const result = await this.adminUsersService.delete(id, banReason);
    res.json({
      message: `Usuário ${result.name} banido com sucesso`,
      data: result,
    });
  };
}
