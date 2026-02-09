import { inject, injectable } from "tsyringe";
import { DashboardService } from "./dashboard.service";
import { Request, Response } from "express";

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
    const result = await this.dashboardService.getLastSales();
    res.json(result);
  };
}
