import { inject, injectable } from "tsyringe";
import { PrismaDB } from "../../database/prisma";
import { ICreateReviewInput } from "./interface/review.interface";

@injectable()
export class ReviewRepository {
  constructor(@inject(PrismaDB) private readonly prisma: PrismaDB) {}

  async findUniqueByBookId(userId: string, bookId: string) {
    return await this.prisma.review.findUnique({
      where: {
        userId_bookId: { userId, bookId },
      },
    });
  }

  async findByBookId(bookId: string) {
    return await this.prisma.review.findMany({
      where: {
        bookId,
      },
      omit: {
        userId: true,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async create(userId: string, bookId: string, data: ICreateReviewInput) {
    return await this.prisma.review.upsert({
      where: {
        userId_bookId: { userId, bookId },
      },
      update: data,
      create: {
        ...data,
        userId,
        bookId,
      },
      omit: {
        userId: true,
      },
    });
  }
}
