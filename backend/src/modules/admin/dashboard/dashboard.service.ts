import { inject, injectable } from "tsyringe";
import { DashboardRepository } from "./dashboard.repository";

@injectable()
export class DashboardService {
  constructor(
    @inject(DashboardRepository)
    private readonly dashboardRepository: DashboardRepository,
  ) {}

  async getOverviewMetrics() {
    return await this.dashboardRepository.getOverviewMetrics();
  }

  async getLastSales(page: number) {
    return await this.dashboardRepository.getLastSales(page);
  }
}
