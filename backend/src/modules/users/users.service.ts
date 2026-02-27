import { inject, injectable } from "tsyringe";
import {
  IFindManyForAdminQuery,
  IUsersRepository,
} from "./interfaces/user.interface";
import { UsersRepository } from "./users.repository";
import { NotFoundError } from "../../shared/errors/not-found-error";

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

  findManyforAdmin(query: IFindManyForAdminQuery) {
    return this.usersRepository.findManyforAdmin(query);
  }
}
