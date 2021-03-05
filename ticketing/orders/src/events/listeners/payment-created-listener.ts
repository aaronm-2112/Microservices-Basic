import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@ecomtest/tickets-common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCompletePublisher } from "../publishers/order-completed-publisher";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    // TODO: Publish an event that marks the order as updated/complete
    await new OrderCompletePublisher(this.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      email: order.email,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    msg.ack();
  }
}
