import { inject, injectable } from "tsyringe";
import { CategoriesRepository } from "./categories.repository";
import {
  ICreateCategoryInput,
  IUpdateCategoryInput,
} from "./interface/categories.interface";
import { NotFoundError } from "../../shared/errors/not-found-error";

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

  async update(id: string, data: IUpdateCategoryInput) {
    const categoryExists = await this.repository.findById(id);
    if (!categoryExists) {
      throw new NotFoundError("Categoria não encontrada");
    }
    return await this.repository.update(id, data);
  }

  async delete(id: string) {
    const categoryExists = await this.repository.findById(id);
    if (!categoryExists) {
      throw new NotFoundError("Categoria não encontrada");
    }
    return await this.repository.delete(id);
  }
}
