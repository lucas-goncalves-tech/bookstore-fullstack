import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { BookParamsDto } from "./dtos/book-params";
import { ReviewService } from "../reviews/review.service";
import { CreateReviewDto } from "../reviews/dtos/review.dto";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";
import { BookReviewsQueryDTO } from "./dtos/book-query.dto";

@injectable()
export class BookReviewsController {
  constructor(
    @inject(ReviewService) private readonly reviewService: ReviewService,
  ) {}

  findReviewsByBookId = async (req: Request, res: Response) => {
    const { id } = req.safeParams as BookParamsDto;
    const query = req.safeQuery as BookReviewsQueryDTO;
    const reviews = await this.reviewService.findManyByBookId(id, query);
    return res.status(200).json(reviews);
  };

  findMyReview = async (req: Request, res: Response) => {
    const { id } = req.safeParams as BookParamsDto;
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedError("Usuário não autenticado");
    }

    const review = await this.reviewService.findMyReview(userId, id);
    return res.status(200).json(review);
  };

  createReview = async (req: Request, res: Response) => {
    const { id } = req.safeParams as BookParamsDto;
    const data = req.safeBody as CreateReviewDto;
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedError("Usuário não autenticado");
    }
    const review = await this.reviewService.create(userId, id, data);
    return res.status(201).json({
      message: `Avaliação do livro ${review.bookId} criada com sucesso`,
      data: review,
    });
  };

  deleteReview = async (req: Request, res: Response) => {
    const { id } = req.safeParams as BookParamsDto;
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedError("Usuário não autenticado");
    }
    await this.reviewService.delete(id, userId);
    return res.status(204).end();
  };
}
