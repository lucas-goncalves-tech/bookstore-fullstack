import { inject, injectable } from "tsyringe";
import { OrderService } from "./orders.service";
import { Request, Response } from "express";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";
import { CreateOrderDto } from "./dtos/orders.dto";

@injectable()
export class OrderController {
  constructor(
    @inject(OrderService) private readonly orderService: OrderService,
  ) {}

  createOrder = async (req: Request, res: Response) => {
    const items = req.safeBody as CreateOrderDto;
    const id = req.user?.sid;
    if (!id) {
      throw new UnauthorizedError("Usuário não autenticado!");
    }
    await this.orderService.createOrder(id, items);
    return res.status(201).json({ message: "Pedido criado com sucesso!" });
  };

  findMany = async (req: Request, res: Response) => {
    const id = req.user?.sid;
    if (!id) {
      throw new UnauthorizedError("Usuário não autenticado!");
    }
    const orders = await this.orderService.findMany(id);
    return res.status(200).json(orders);
  };
}
