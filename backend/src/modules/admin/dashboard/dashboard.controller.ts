import { inject, injectable } from "tsyringe";
import { DashboardService } from "./dashboard.service";
import { Request, Response } from "express";
import { DashBoardQueryDto } from "./dtos/dashboard-querys.dto";

@injectable()
export class DashboardController {
  constructor(
    @inject(DashboardService)
    private readonly dashboardService: DashboardService,
  ) {}

  getOverviewMetrics = async (req: Request, res: Response) => {
    const result = await this.dashboardService.getOverviewMetrics();

    res.json(result);
  };

  getLastSales = async (req: Request, res: Response) => {
    const { page } = req.safeQuery as DashBoardQueryDto;
    const result = await this.dashboardService.getLastSales(page);
    res.json(result);
  };
}
