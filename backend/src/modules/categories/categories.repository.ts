import { inject, injectable } from "tsyringe";
import { PrismaDB } from "../../database/prisma";
import { ICreateCategoryInput } from "./interface/categories.interface";

@injectable()
export class CategoriesRepository {
  constructor(@inject(PrismaDB) private readonly prisma: PrismaDB) {}

  async findMany() {
    return await this.prisma.category.findMany();
  }

  async create(data: ICreateCategoryInput) {
    return await this.prisma.category.create({
      data,
    });
  }
}
