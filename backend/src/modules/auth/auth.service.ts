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
import { ILoginInput } from "./interface/auth.interface";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";
import { generateToken } from "../../shared/secutiry/token.service";

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

  async login(data: ILoginInput): Promise<string> {
    const userExist = await this.usersRepository.findByEmail(data.email);
    const FAKE_HASH =
      "$2b$10$D7Y/.IVUm.SFcnYQE4dlb.BPJtVCwmOV/kaehohZrWeodfAEP8qqS";
    const hashToCompare = userExist ? userExist.passwordHash : FAKE_HASH;
    const isPassValid = await bcrypt.compare(data.password, hashToCompare);

    if (!userExist || !isPassValid) {
      throw new UnauthorizedError("Email ou senha inválido!");
    }

    return generateToken({
      sid: userExist.id,
      role: userExist.role,
    });
  }
}
