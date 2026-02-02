import { inject, injectable } from "tsyringe";
import { PrismaDB } from "../../database/prisma";

@injectable()
export class CategoriesRepository {
  constructor(@inject(PrismaDB) private readonly prisma: PrismaDB) {}

  async findMany() {
    return await this.prisma.category.findMany();
  }
}
