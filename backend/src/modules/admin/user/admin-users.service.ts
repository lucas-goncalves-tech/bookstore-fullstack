import { inject, injectable } from "tsyringe";
import {
  ICreateUser,
  ICreateUserInput,
  IFindManyForAdminQuery,
  IUpdateUser,
  IUsersRepository,
} from "../../users/interfaces/user.interface";
import { UsersRepository } from "../../users/users.repository";
import { NotFoundError } from "../../../shared/errors/not-found-error";
import { ConflictError } from "../../../shared/errors/conflict.error";
import bcrypt from "bcrypt";

@injectable()
export class AdminUsersService {
  constructor(
    @inject(UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async findMany(query: IFindManyForAdminQuery) {
    return await this.usersRepository.findManyforAdmin(query);
  }

  async create(data: ICreateUserInput) {
    const emailExist = await this.usersRepository.findByKey(
      "email",
      data.email,
    );
    if (emailExist) throw new ConflictError("Email já cadastrado");

    const passwordHash = await bcrypt.hash(data.password, 10);
    const newUser: ICreateUser = {
      email: data.email,
      name: data.name,
      passwordHash,
      role: data.role,
    };
    return await this.usersRepository.create(newUser);
  }

  async update(id: string, data: IUpdateUser) {
    const user = await this.usersRepository.findByKey("id", id);
    if (!user) throw new NotFoundError("Usuário não encontrado");

    if (data.email && data.email !== user.email) {
      const emailExist = await this.usersRepository.findByKey(
        "email",
        data.email,
      );
      if (emailExist) throw new ConflictError("Email já cadastrado");
    }
    return await this.usersRepository.update(id, data);
  }
}
