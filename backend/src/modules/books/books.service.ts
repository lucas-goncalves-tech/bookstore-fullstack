import { inject, injectable } from "tsyringe";
import { BookRepository } from "./books.repository";
import { ICreateBookInput, IFindManyQuery } from "./interface/books.interface";

@injectable()
export class BookService {
  constructor(
    @inject(BookRepository) private readonly bookRepository: BookRepository,
  ) {}

  async findMany(query: IFindManyQuery) {
    return await this.bookRepository.findMany(query);
  }

  async create(data: ICreateBookInput) {
    return await this.bookRepository.create(data);
  }
}
