import { inject, injectable } from "tsyringe";
import { BookService } from "./books.service";
import { Request, Response } from "express";
import { BookQueryDTO } from "./dtos/book-query.dto";
import { CreateBookDto, UpdateBookDto } from "./dtos/book.dto";
import { BookParamsDto } from "./dtos/book-params";
import { BadRequestError } from "../../shared/errors/bad-request.error";
import { ReviewService } from "../reviews/review.service";
import { CreateReviewDto } from "../reviews/dtos/review.dto";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";

@injectable()
export class BookController {
  constructor(
    @inject(BookService) private readonly bookService: BookService,
    @inject(ReviewService) private readonly reviewService: ReviewService,
  ) {}

  findById = async (req: Request, res: Response) => {
    const { id } = req.safeParams as BookParamsDto;
    const result = await this.bookService.findById(id);

    res.json(result);
  };

  findReviewsByBookId = async (req: Request, res: Response) => {
    const { id } = req.safeParams as BookParamsDto;
    const reviews = await this.reviewService.findByBookId(id);
    return res.status(200).json(reviews);
  };

  findMany = async (req: Request, res: Response) => {
    const query = req.safeQuery as BookQueryDTO;
    const result = await this.bookService.findMany(query);

    res.json(result);
  };

  create = async (req: Request, res: Response) => {
    const data = req.safeBody as CreateBookDto;
    const result = await this.bookService.create(data);

    res.status(201).json({
      message: `Livro ${result.title} criado com sucesso`,
      data: result,
    });
  };

  createReview = async (req: Request, res: Response) => {
    const { id } = req.safeParams as BookParamsDto;
    const data = req.safeBody as CreateReviewDto;
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedError("Usuário não autenticado");
    }
    const review = await this.reviewService.create(userId, id, data);
    return res.status(201).json(review);
  };

  uploadCover = async (req: Request, res: Response) => {
    const { id } = req.safeParams as BookParamsDto;
    const file = req.file;

    if (!file) {
      throw new BadRequestError("Arquivo não enviado");
    }

    const urls = await this.bookService.uploadCover(id, file);

    res.status(201).json({
      message: `Capa do livro enviada com sucesso`,
      data: urls,
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.safeParams as BookParamsDto;
    const data = req.safeBody as UpdateBookDto;
    const result = await this.bookService.update(id, data);

    res.json({
      message: `Livro ${result.title} atualizado com sucesso`,
      data: result,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.safeParams as BookParamsDto;
    await this.bookService.delete(id);

    res.status(204).end();
  };
}
