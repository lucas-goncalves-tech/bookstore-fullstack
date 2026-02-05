import { Decimal } from "@prisma/client/runtime/library";
import { prisma_test } from "../setup";

interface CreateOrderWithItemProps {
  userId: string;
  bookId: string;
  quantity: number;
  priceAtTime: Decimal;
}

export function createOrderWithItem({
  userId,
  bookId,
  quantity,
  priceAtTime,
}: CreateOrderWithItemProps) {
  return prisma_test.order.create({
    data: {
      userId,
      total: Number(priceAtTime) * quantity,
      status: "CONFIRMED",
      orderItem: {
        create: {
          bookId,
          quantity,
          priceAtTime,
        },
      },
    },
  });
}
