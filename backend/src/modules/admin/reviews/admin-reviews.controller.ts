import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { FindManyForAdminReviewsQueryDto } from "./dtos/admin-reviews-query.dto";
import { AdminReviewsService } from "./admin-reviews.service";

@injectable()
export class AdminReviewsController {
  constructor(
    @inject(AdminReviewsService)
    private readonly adminReviewsService: AdminReviewsService,
  ) {}

  findMany = async (req: Request, res: Response) => {
    const query = req.safeQuery as FindManyForAdminReviewsQueryDto;
    // const result = await this.adminReviewsService.findMany(query);
    // res.json(result);
    res.json({ data: [], metadata: { page: query.page, limit: query.limit, total: 0, totalPages: 0 } }); // Mock implementation
  };
}
