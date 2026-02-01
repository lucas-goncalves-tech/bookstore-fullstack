import { inject, injectable } from "tsyringe";
import { BookService } from "./books.service";
import { Request, Response } from "express";
import { BookQueryDTO } from "./dtos/book-query.dto";
import { CreateBookDto } from "./dtos/create-book.dto";

@injectable()
export class BookController {
  constructor(@inject(BookService) private readonly bookService: BookService) {}

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
