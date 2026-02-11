import { inject, injectable } from "tsyringe";
import { ICreateUser, IUsersRepository } from "./interfaces/user.interface";
import { PrismaDB } from "../../database/prisma";
import { Prisma, User } from "@prisma/client";

@injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@inject(PrismaDB) private readonly prisma: PrismaDB) {}

  async findByKey(key: "id" | "email", value: string): Promise<User | null> {
    const where: Prisma.UserWhereUniqueInput =
      key === "id" ? { id: value } : { email: value };
    return await this.prisma.user.findUnique({ where });
  }

  async create(data: ICreateUser): Promise<User> {
    return await this.prisma.user.create({ data });
  }
}
