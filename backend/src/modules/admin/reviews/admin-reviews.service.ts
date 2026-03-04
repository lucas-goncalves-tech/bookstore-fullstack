import { inject, injectable } from "tsyringe";
import { FindManyForAdminReviewsQueryDto } from "./dtos/admin-reviews-query.dto";
import { ReviewRepository } from "../../reviews/reviews.repository";

@injectable()
export class AdminReviewsService {
  constructor(
    @inject(ReviewRepository)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async findMany(query: FindManyForAdminReviewsQueryDto) {
    return await this.reviewRepository.findManyForAdmin(query);
  }
}
