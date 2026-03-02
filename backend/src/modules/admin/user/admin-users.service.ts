import { inject, injectable } from "tsyringe";
import {
  ICreateUser,
  ICreateUserInput,
  IFindManyForAdminQuery,
  IUpdateUser,
  IUpdateUserPasswordInput,
  IUsersRepository,
} from "../../users/interfaces/user.interface";
import { UsersRepository } from "../../users/users.repository";
import { NotFoundError } from "../../../shared/errors/not-found-error";
import { ConflictError } from "../../../shared/errors/conflict.error";
import { ForbiddenError } from "../../../shared/errors/forbidden.error";
import bcrypt from "bcrypt";
import { PrismaDB } from "../../../database/prisma";

@injectable()
export class AdminUsersService {
  constructor(
    @inject(UsersRepository)
    private readonly usersRepository: IUsersRepository,
    @inject(PrismaDB)
    private readonly prisma: PrismaDB,
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

  async update(adminId: string, id: string, data: IUpdateUser) {
    if (adminId === id && data.role) {
      throw new ForbiddenError("Não é permitido alterar sua própria role");
    }

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

  async updatePassword(id: string, data: IUpdateUserPasswordInput) {
    const user = await this.usersRepository.findByKey("id", id);
    if (!user) throw new NotFoundError("Usuário não encontrado");
    const passwordHash = await bcrypt.hash(data.password, 10);
    await this.prisma.$transaction(async (tx) => {
      await tx.session.updateMany({
        where: {
          userId: id,
        },
        data: {
          revokedAt: new Date(),
        },
      });
      await tx.user.update({
        where: {
          id,
        },
        data: {
          passwordHash,
        },
      });
    });
  }

  async restore(id: string) {
    const user = await this.usersRepository.findByKey("id", id);
    if (!user) throw new NotFoundError("Usuário não encontrado");
    return await this.prisma.$transaction(async (tx) => {
      await tx.review.updateMany({
        where: {
          userId: id,
        },
        data: {
          deletedAt: null,
        },
      });
      return await tx.user.update({
        where: {
          id,
        },
        data: {
          bannedAt: null,
          banReason: null,
        },
      });
    });
  }

  async ban(adminId: string, id: string, banReason: string) {
    if (adminId === id) {
      throw new ForbiddenError("Não é permitido banir a si mesmo");
    }

    const user = await this.usersRepository.findByKey("id", id);
    if (!user) throw new NotFoundError("Usuário não encontrado");

    return await this.prisma.$transaction(async (tx) => {
      await tx.review.updateMany({
        where: {
          userId: id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
      return await tx.user.update({
        where: {
          id,
        },
        data: {
          banReason,
          bannedAt: new Date(),
        },
      });
    });
  }

  async delete(adminId: string, id: string) {
    if (adminId === id) {
      throw new ForbiddenError("Não é permitido excluir a si mesmo");
    }

    const user = await this.usersRepository.findByKey("id", id);
    if (!user) throw new NotFoundError("Usuário não encontrado");
    await this.usersRepository.delete(id);
  }
}
