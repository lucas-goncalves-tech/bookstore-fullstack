import { inject, injectable } from "tsyringe";
import { PrismaDB } from "../../database/prisma";

@injectable()
export class OrdersRepository {
  constructor(@inject(PrismaDB) private prisma: PrismaDB) {}

  async findMany(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { orderItem: true },
        },
      },
    });
  }

  async findById(userId: string, id: string) {
    return this.prisma.order.findUnique({
      where: { id, userId },
      include: {
        orderItem: {
          select: {
            quantity: true,
            priceAtTime: true,
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                coverThumbUrl: true,
                category: { select: { name: true } },
              },
            },
          },
        },
      },
    });
  }
}
