import { inject, injectable } from "tsyringe";
import { ReviewService } from "./review.service";
import { Request, Response } from "express";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";

@injectable()
export class ReviewController {
  constructor(
    @inject(ReviewService)
    private readonly reviewService: ReviewService,
  ) {}

  findManyByUserId = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("Usuário não autenticado");
    }

    const reviews = await this.reviewService.findManyByUserId(user.sub);
    return res.json(reviews);
  };
}
