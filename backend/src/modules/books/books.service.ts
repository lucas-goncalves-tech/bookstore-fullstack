import { inject, injectable } from "tsyringe";
import { BookRepository } from "./books.repository";
import { IFindManyQuery } from "./interface/books.interface";

@injectable()
export class BookService {
  constructor(
    @inject(BookRepository) private readonly bookRepository: BookRepository,
  ) {}

  async findMany(query: IFindManyQuery) {
    const result = await this.bookRepository.findMany(query);
    const data = result.data.map(({ price, ...rest }) => ({
      ...rest,
      price: Number(price),
    }));
    return {
      data,
      metadata: result.metadata,
    };
  }
}
