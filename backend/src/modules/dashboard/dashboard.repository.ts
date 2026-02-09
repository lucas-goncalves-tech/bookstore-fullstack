import { inject, injectable } from "tsyringe";
import { PrismaDB } from "../../database/prisma";

@injectable()
export class DashboardRepository {
  constructor(@inject(PrismaDB) private readonly prisma: PrismaDB) {}
  async getOverviewMetrics() {
    const [revenue, users, sales] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),
      this.prisma.user.count({
        select: {
          _all: true,
        },
      }),
      this.prisma.orderItem.aggregate({
        _sum: {
          quantity: true,
        },
      }),
    ]);

    return {
      revenue: revenue._sum.total,
      totalUsers: users._all,
      sales: sales._sum.quantity,
    };
  }

  async getLastSales(take = 10) {
    return this.prisma.order.findMany({
      take,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        status: true,
        total: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
        orderItem: {
          select: {
            quantity: true,
            priceAtTime: true,
            book: {
              select: {
                title: true,
                author: true,
                coverThumbUrl: true,
              },
            },
          },
        },
      },
    });
  }
}
