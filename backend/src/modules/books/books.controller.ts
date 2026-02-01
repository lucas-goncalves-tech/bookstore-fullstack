import { inject, injectable } from "tsyringe";
import { BookService } from "./books.service";
import { Request, Response } from "express";
import { BookQueryDTO } from "./dtos/book-query.dto";
import { CreateBookDto } from "./dtos/create-book.dto";
import { BookParamsDto } from "./dtos/book-params";

@injectable()
export class BookController {
  constructor(@inject(BookService) private readonly bookService: BookService) {}

  findById = async (req: Request, res: Response) => {
    const { id } = req.safeParams as BookParamsDto;
    const result = await this.bookService.findById(id);

    res.json(result);
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
}
