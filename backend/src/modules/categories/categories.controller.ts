import { inject, injectable } from "tsyringe";
import { CategoriesService } from "./categories.service";
import { Request, Response } from "express";

@injectable()
export class CategoriesController {
  constructor(
    @inject(CategoriesService)
    private readonly service: CategoriesService,
  ) {}

  findMany = async (_req: Request, res: Response) => {
    const categories = await this.service.findMany();
    return res.json(categories);
  };
}
