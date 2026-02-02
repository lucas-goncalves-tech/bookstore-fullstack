import { inject, injectable } from "tsyringe";
import { CategoriesRepository } from "./categories.repository";
import { ICreateCategoryInput } from "./interface/categories.interface";

@injectable()
export class CategoriesService {
  constructor(
    @inject(CategoriesRepository)
    private readonly repository: CategoriesRepository,
  ) {}

  async findMany() {
    return await this.repository.findMany();
  }

  async create(data: ICreateCategoryInput) {
    return await this.repository.create(data);
  }
}
