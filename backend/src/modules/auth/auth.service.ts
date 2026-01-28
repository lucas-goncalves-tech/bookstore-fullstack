import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { UsersRepository } from "../users/users.repository";
import {
  ICreateUser,
  ICreateUserInput,
  ISafeUser,
  IUsersRepository,
} from "../users/interfaces/user.interface";
import { ConflictError } from "../../shared/errors/conflict.error";
import { env } from "../../core/config/env";

@injectable()
export class AuthService {
  constructor(
    @inject(UsersRepository) private readonly usersRepository: IUsersRepository,
  ) {}

  async create(data: ICreateUserInput): Promise<ISafeUser> {
    const userExist = await this.usersRepository.findByEmail(data.email);
    if (userExist) {
      throw new ConflictError("Email já cadastrado");
    }

    const hash = await bcrypt.hash(data.password, env.SALT);
    const newUser: ICreateUser = {
      email: data.email,
      name: data.name,
      passwordHash: hash,
    };

    const result = await this.usersRepository.create(newUser);

    //eslint-disable-next-line
    const { id, passwordHash, ...safe } = result;
    return safe;
  }
}
