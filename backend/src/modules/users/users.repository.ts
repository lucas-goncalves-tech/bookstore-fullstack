import { inject } from "tsyringe";
import { ICreateUser, IUsersRepository } from "./interfaces/user.interface";
import { PrismaDB } from "../../database/prisma";

export class UsersRepository implements IUsersRepository {
  constructor(@inject(PrismaDB) private readonly prisma: PrismaDB) {}

  async create(data: ICreateUser) {}
}
