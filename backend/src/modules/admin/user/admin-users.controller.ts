import { inject, injectable } from "tsyringe";
import { UsersService } from "../../users/users.service";
import { Request, Response } from "express";
import { FindManyForAdminQueryDto } from "./dtos/admin-users-query.dto";
import { AdminCreateUserDto } from "./dtos/admin-users.dto";

@injectable()
export class AdminUsersController {
  constructor(
    @inject(UsersService) private readonly usersService: UsersService,
  ) {}

  findMany = async (req: Request, res: Response) => {
    const query = req.safeQuery as FindManyForAdminQueryDto;
    const result = await this.usersService.findManyforAdmin(query);
    res.json(result);
  };

  createUser = async (req: Request, res: Response) => {
    const body = req.safeBody as AdminCreateUserDto;
    const result = await this.usersService.createuserForAdmin(body);
    res.status(201).json({
      message: `Usuário ${result.name} criado com sucesso`,
      data: result,
    });
  };
}
