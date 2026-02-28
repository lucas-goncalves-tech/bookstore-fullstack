import { inject, injectable } from "tsyringe";
import {
  ICreateUser,
  IFindManyForAdminQuery,
  IUpdateUser,
  IUsersRepository,
} from "./interfaces/user.interface";
import { PrismaDB } from "../../database/prisma";
import { Prisma } from "@prisma/client";

@injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@inject(PrismaDB) private readonly prisma: PrismaDB) {}

  async findByKey(key: "id" | "email", value: string) {
    const where: Prisma.UserWhereUniqueInput =
      key === "id" ? { id: value } : { email: value };
    return await this.prisma.user.findUnique({ where });
  }

  async findManyforAdmin({
    page = 1,
    limit = 10,
    search,
    order = "desc",
  }: IFindManyForAdminQuery) {
    const skip = (page - 1) * limit;
    const take = limit > 100 ? 100 : limit;
    let where: Prisma.UserWhereInput = {};
    if (search) {
      where = {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: {
          createdAt: order,
        },
        skip,
        take,
        omit: {
          passwordHash: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: ICreateUser) {
    return await this.prisma.user.create({
      data,
      omit: { passwordHash: true, id: true },
    });
  }

  async update(id: string, data: IUpdateUser) {
    return await this.prisma.user.update({
      where: { id },
      data,
      omit: { passwordHash: true, id: true },
    });
  }
}
