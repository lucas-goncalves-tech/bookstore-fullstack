import { injectable } from "tsyringe";
import { FindManyForAdminReviewsQueryDto } from "./dtos/admin-reviews-query.dto";

@injectable()
export class AdminReviewsService {
  async findMany(query: FindManyForAdminReviewsQueryDto) {
    // Implementation placeholder. You can use query here.
    void query; // To suppress unused variable lint
    return { data: [], metadata: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  }
}
