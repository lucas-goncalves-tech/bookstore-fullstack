import { inject, injectable } from "tsyringe";
import { OrderService } from "./orders.service";
import { Request, Response } from "express";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";
import { CreateOrderDto } from "./dtos/orders.dto";
import { OrderParamsDto } from "./dtos/order-params.dto";

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
    const order = await this.orderService.createOrder(id, items);
    return res
      .status(201)
      .json({ message: "Pedido criado com sucesso!", data: order });
  };

  findMany = async (req: Request, res: Response) => {
    const id = req.user?.sid;
    if (!id) {
      throw new UnauthorizedError("Usuário não autenticado!");
    }
    const orders = await this.orderService.findMany(id);
    return res.status(200).json(orders);
  };

  findById = async (req: Request, res: Response) => {
    const id = req.user?.sid;
    const orderId = req.safeParams as OrderParamsDto;
    if (!id) {
      throw new UnauthorizedError("Usuário não autenticado!");
    }
    const order = await this.orderService.findById(id, orderId.id);
    return res.status(200).json(order);
  };
}
