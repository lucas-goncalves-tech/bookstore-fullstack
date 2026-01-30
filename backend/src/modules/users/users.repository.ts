import { inject, injectable } from "tsyringe";
import { ICreateUser, IUsersRepository } from "./interfaces/user.interface";
import { PrismaDB } from "../../database/prisma";
import { User } from "@prisma/client";

@injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@inject(PrismaDB) private readonly prisma: PrismaDB) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(data: ICreateUser): Promise<User> {
    return await this.prisma.user.create({ data });
  }
}
