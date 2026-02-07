import { inject, injectable } from "tsyringe";
import { ReviewRepository } from "./review.repository";
import { ICreateReviewInput } from "./interface/review.interface";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { BookRepository } from "../books/books.repository";

@injectable()
export class ReviewService {
  constructor(
    @inject(ReviewRepository)
    private readonly reviewRepository: ReviewRepository,
    @inject(BookRepository)
    private readonly bookRepository: BookRepository,
  ) {}

  async findByBookId(bookId: string) {
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new NotFoundError("Livro não encontrado");
    }
    const [reviews, stats] = await Promise.all([
      this.reviewRepository.findByBookId(bookId),
      this.reviewRepository.getBookReviewStats(bookId),
    ]);
    return {
      reviews,
      averageRating: stats._avg.rating ?? 0,
      totalReviews: stats._count.rating,
    };
  }

  async create(userId: string, bookId: string, data: ICreateReviewInput) {
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new NotFoundError("Livro não encontrado");
    }
    return await this.reviewRepository.create(userId, bookId, data);
  }
}
