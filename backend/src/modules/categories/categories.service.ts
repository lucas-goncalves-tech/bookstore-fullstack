import { inject, injectable } from "tsyringe";
import { CategoriesRepository } from "./categories.repository";

@injectable()
export class CategoriesService {
  constructor(
    @inject(CategoriesRepository)
    private readonly repository: CategoriesRepository,
  ) {}

  async findMany() {
    return await this.repository.findMany();
  }
}
