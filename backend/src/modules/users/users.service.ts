import { inject, injectable } from "tsyringe";
import {
  ICreateUser,
  ICreateUserInput,
  IFindManyForAdminQuery,
  IUsersRepository,
} from "./interfaces/user.interface";
import { UsersRepository } from "./users.repository";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { ConflictError } from "../../shared/errors/conflict.error";
import bcrypt from "bcrypt";
@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async me(userId: string) {
    const user = await this.usersRepository.findByKey("id", userId);
    if (!user) throw new NotFoundError("Usuário não encontrado");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, id, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findManyforAdmin(query: IFindManyForAdminQuery) {
    return await this.usersRepository.findManyforAdmin(query);
  }

  async createuserForAdmin(data: ICreateUserInput) {
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
}
