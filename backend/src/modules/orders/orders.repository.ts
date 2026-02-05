import { inject, injectable } from "tsyringe";
import { PrismaDB } from "../../database/prisma";

@injectable()
export class OrdersRepository {
  constructor(@inject(PrismaDB) private prisma: PrismaDB) {}

  async findMany(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
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
                coverUrl: true,
                coverThumbUrl: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
