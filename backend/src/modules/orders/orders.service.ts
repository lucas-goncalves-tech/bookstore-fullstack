import { inject, injectable } from "tsyringe";
import { PrismaDB } from "../../database/prisma";
import { OrderItems } from "./interface/orders.interface";
import { ConflictError } from "../../shared/errors/conflict.error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { Decimal } from "@prisma/client/runtime/client";
import { OrdersRepository } from "./orders.repository";

@injectable()
export class OrderService {
  constructor(
    @inject(PrismaDB) private readonly prisma: PrismaDB,
    @inject(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async createOrder(userId: string, items: OrderItems[]) {
    await this.prisma.$transaction(async (tx) => {
      let totalRevenue = 0;
      const books = await tx.book.findMany({
        where: {
          id: {
            in: items.map((i) => i.id),
          },
        },
      });
      const bookMap = new Map(books?.map((b) => [b.id, b]));

      const order = await tx.order.create({
        data: { userId, total: 0 },
      });

      for (const item of items) {
        const bookUpdated = await tx.book.updateMany({
          where: {
            id: item.id,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });
        const book = bookMap.get(item.id);

        if (!book) {
          throw new NotFoundError(`Livro não encontrado!`);
        }
        if (bookUpdated.count === 0) {
          throw new ConflictError(`Produto ${book.title} sem estoque!`);
        }

        await tx.orderItem.create({
          data: {
            priceAtTime: book.price,
            quantity: item.quantity,
            bookId: book.id,
            orderId: order.id,
          },
        });

        totalRevenue += Number(book.price) * item.quantity;
      }

      await tx.order.update({
        data: {
          status: "CONFIRMED",
          total: new Decimal(totalRevenue),
        },
        where: {
          id: order.id,
        },
      });

      return order;
    });
  }

  async findMany(userId: string) {
    const orders = await this.ordersRepository.findMany(userId);
    const safeOrders = orders.map((order) => ({
      ...order,
      userId: "[SAFE_ID]",
    }));
    return safeOrders;
  }

  async findById(userId: string, id: string) {
    const order = await this.ordersRepository.findById(userId, id);
    if (!order) {
      throw new NotFoundError(`Pedido não encontrado!`);
    }
    const safeOrder = {
      ...order,
      userId: "[SAFE_ID]",
    };
    return safeOrder;
  }
}
