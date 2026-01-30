import { inject, injectable } from "tsyringe";
import { BookService } from "./books.service";
import { Request, Response } from "express";
import { BookQueryDTO } from "./dtos/book-query.dto";

@injectable()
export class BookController {
  constructor(@inject(BookService) private readonly bookService: BookService) {}

  findMany = async (req: Request, res: Response) => {
    const query = req.safeQuery as BookQueryDTO;
    const result = await this.bookService.findMany(query);

    res.json(result);
  };
}
