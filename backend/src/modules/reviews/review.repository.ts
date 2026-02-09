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

  async findManyByBookId(bookId: string) {
    const [reviews, stats] = await Promise.all([
      this.prisma.review.findMany({
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
      }),
      this.prisma.review.aggregate({
        where: {
          bookId,
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      }),
    ]);

    return {
      reviews,
      averageRating: stats._avg.rating ?? 0,
      totalReviews: stats._count.rating,
    };
  }

  async findManyByUserId(userId: string) {
    const [reviews, stats] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          userId,
        },
        omit: {
          userId: true,
        },
        include: {
          book: {
            select: {
              title: true,
              category: { select: { name: true } },
              coverUrl: true,
              author: true,
            },
          },
        },
      }),
      this.prisma.review.aggregate({
        where: {
          userId,
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      }),
    ]);

    return {
      reviews,
      averageRating: stats._avg.rating ?? 0,
      totalReviews: stats._count.rating,
    };
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
