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
    categorySlug,
    search,
    minPrice,
    maxPrice,
  }: IFindManyQuery): Promise<IFindMany> {
    const skip = (page - 1) * limit;
    const safeLimit = limit > 100 ? 100 : limit;
    const where: Prisma.BookWhereInput = {};

    where.deletedAt = null;
    if (categorySlug) where.category = { slug: categorySlug };
    if (search)
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ];
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      };
    }
    const [data, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { createdAt: "desc" },
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

  async create(data: ICreateBookInput): Promise<Book> {
    return await this.prisma.book.create({
      data,
    });
  }

  async update(id: string, data: IUpdateBookInput): Promise<Book> {
    return await this.prisma.book.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.book.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
