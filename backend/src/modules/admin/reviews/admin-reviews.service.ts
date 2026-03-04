import { inject, injectable } from "tsyringe";
import { FindManyForAdminReviewsQueryDto } from "./dtos/admin-reviews-query.dto";
import { ReviewRepository } from "../../reviews/reviews.repository";
import { NotFoundError } from "../../../shared/errors/not-found-error";

@injectable()
export class AdminReviewsService {
  constructor(
    @inject(ReviewRepository)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async findMany(query: FindManyForAdminReviewsQueryDto) {
    return await this.reviewRepository.findManyForAdmin(query);
  }

  async delete(id: string) {
    const review = await this.reviewRepository.findById(id);
    if (!review) throw new NotFoundError("Review não encontrada");
    await this.reviewRepository.deleteById(id);
  }
}

