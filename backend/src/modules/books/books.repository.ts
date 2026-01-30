import { inject, injectable } from "tsyringe";
import { PrismaDB } from "../../database/prisma";
import {
  IBookRepository,
  ICreateBookInput,
  IFindMany,
  IFindManyQuery,
  IUpdateBookInput,
} from "./interface/books.interface";
import { Book, Prisma } from "@prisma/client";

@injectable()
export class BookRepository implements IBookRepository {
  constructor(@inject(PrismaDB) private readonly prisma: PrismaDB) {}

  async findById(id: string): Promise<Book | null> {
    return await this.prisma.book.findUnique({
      where: { id },
    });
  }

  async findMany({
    page = 1,
    limit = 10,
    categoryId,
    search,
  }: IFindManyQuery): Promise<IFindMany> {
    const skip = (page - 1) * limit;
    const safeLimit = limit > 100 ? 100 : limit;
    const where: Prisma.BookWhereInput = {};

    where.deletedAt = null;
    if (categoryId) where.categoryId = categoryId;
    if (search)
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ];
    const [data, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: safeLimit,
      }),
      this.prisma.book.count({ where }),
    ]);
    return {
      data,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  create(data: ICreateBookInput): Promise<Book> {
    throw new Error("Method not implemented.");
  }

  update(id: string, data: IUpdateBookInput): Promise<Book> {
    throw new Error("Method not implemented.");
  }

  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
