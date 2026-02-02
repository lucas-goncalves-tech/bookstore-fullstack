import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "./interfaces/user.interface";
import { UsersRepository } from "./users.repository";
import { NotFoundError } from "../../shared/errors/not-found-error";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async me(id: string) {
    const user = await this.usersRepository.findByKey("id", id);
    if (!user) throw new NotFoundError("Usuário não encontrado");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
