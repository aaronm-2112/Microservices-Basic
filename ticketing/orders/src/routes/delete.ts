import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@ecomtest/tickets-common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    console.log(`In delete order's ticket is: ${order!.ticket}`);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publish an event saying this was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id as string,
      version: order.version,
      ticket: {
        id: order.ticket.id as string,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
