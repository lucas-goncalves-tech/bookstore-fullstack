import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { FindManyForAdminReviewsQueryDto } from "./dtos/admin-reviews-query.dto";
import { AdminReviewsService } from "./admin-reviews.service";
import { AdminReviewParamsDto } from "./dtos/admin-reviews-params.dto";

@injectable()
export class AdminReviewsController {
  constructor(
    @inject(AdminReviewsService)
    private readonly adminReviewsService: AdminReviewsService,
  ) {}

  findMany = async (req: Request, res: Response) => {
    const query = req.safeQuery as FindManyForAdminReviewsQueryDto;
    const result = await this.adminReviewsService.findMany(query);
    res.json(result);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.safeParams as AdminReviewParamsDto;
    await this.adminReviewsService.delete(id);
    res.status(204).end();
  };
}
