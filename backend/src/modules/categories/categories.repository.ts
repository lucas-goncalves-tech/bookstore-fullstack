import { inject, injectable } from "tsyringe";
import { PrismaDB } from "../../database/prisma";
import {
  ICreateCategoryInput,
  IUpdateCategoryInput,
} from "./interface/categories.interface";
import { Prisma } from "@prisma/client";

@injectable()
export class CategoriesRepository {
  constructor(@inject(PrismaDB) private readonly prisma: PrismaDB) {}

  async findByKey(key: "id" | "slug", value: string) {
    const where: Prisma.CategoryWhereUniqueInput =
      key === "id" ? { id: value } : { slug: value };

    return await this.prisma.category.findUnique({
      where,
    });
  }

  async findMany() {
    return await this.prisma.category.findMany();
  }

  async create(data: ICreateCategoryInput) {
    return await this.prisma.category.create({
      data,
    });
  }

  async update(id: string, data: IUpdateCategoryInput) {
    return await this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await this.prisma.category.delete({
      where: { id },
    });
  }
}
