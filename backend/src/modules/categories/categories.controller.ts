import { inject, injectable } from "tsyringe";
import { CategoriesService } from "./categories.service";
import { Request, Response } from "express";
import { CreateCategoryDto, UpdateCategoryDto } from "./dtos/category.dto";
import { CategoryParamsDto } from "./dtos/category-params.dto";

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

  update = async (req: Request, res: Response) => {
    const { id } = req.safeParams as CategoryParamsDto;
    const data = req.safeBody as UpdateCategoryDto;
    const category = await this.service.update(id, data);

    return res.status(200).json({
      message: `Categoria ${category.name} atualizada com sucesso`,
      data: category,
    });
  };
}
