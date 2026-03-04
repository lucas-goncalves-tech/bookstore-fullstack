import { inject, injectable } from "tsyringe";
import { PrismaDB } from "../../database/prisma";
import { ICreateReviewInput, IFindManyForAdminReviewsQuery } from "./interface/reviews.interface";
import { Prisma } from "@prisma/client";

@injectable()
export class ReviewRepository {
  constructor(@inject(PrismaDB) private readonly prisma: PrismaDB) {}

  async findUniqueByBookId(userId: string, bookId: string) {
    return await this.prisma.review.findUnique({
      where: {
        userId_bookId: { userId, bookId },
      },
      omit: {
        userId: true,
      },
    });
  }

  async findManyByBookId(bookId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const safeLimit = limit > 100 ? 100 : limit;
    const [reviews, total, stats] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          bookId,
          deletedAt: null,
        },
        omit: {
          userId: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: safeLimit,
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.review.count({
        where: {
          bookId,
          deletedAt: null,
        },
      }),
      this.prisma.review.aggregate({
        where: {
          bookId,
          deletedAt: null,
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
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
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

  async delete(bookId: string, userId: string) {
    await this.prisma.review.delete({
      where: {
        userId_bookId: { userId, bookId },
      },
    });
  }

  async findManyForAdmin({ page = 1, limit = 10, search, order = "desc" }: IFindManyForAdminReviewsQuery) {
    const skip = (page - 1) * limit;
    const safeLimit = limit > 100 ? 100 : limit;

    const where: Prisma.ReviewWhereInput = {};
    if (search) {
      where.OR = [
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { book: { title: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { createdAt: order },
        select: {
          id: true,
          createdAt: true,
          deletedAt: true,
          rating: true,
          comment: true,
          user: { select: { id: true, name: true, email: true } },
          book: { select: { id: true, title: true, coverThumbUrl: true, author: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: reviews,
      metadata: {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }
}
