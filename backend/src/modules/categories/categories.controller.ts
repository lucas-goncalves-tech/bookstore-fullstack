import { inject, injectable } from "tsyringe";
import { CategoriesService } from "./categories.service";
import { Request, Response } from "express";
import { CreateCategoryDto } from "./dtos/create-category.dto";

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

  create = async (req: Request, res: Response) => {
    const data = req.safeBody as CreateCategoryDto;
    const category = await this.service.create(data);

    return res.status(201).json({
      message: `Categoria ${category.name} criada com sucesso`,
      data: category,
    });
  };
}
