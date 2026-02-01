import { inject, injectable } from "tsyringe";
import { BookRepository } from "./books.repository";
import { ICreateBookInput, IFindManyQuery } from "./interface/books.interface";
import { NotFoundError } from "../../shared/errors/not-found-error";

@injectable()
export class BookService {
  constructor(
    @inject(BookRepository) private readonly bookRepository: BookRepository,
  ) {}

  async findById(id: string) {
    const bookExist = await this.bookRepository.findById(id);
    if (!bookExist) {
      throw new NotFoundError("Livro não encontrado");
    }
    return bookExist;
  }

  async findMany(query: IFindManyQuery) {
    return await this.bookRepository.findMany(query);
  }

  async create(data: ICreateBookInput) {
    return await this.bookRepository.create(data);
  }
}
