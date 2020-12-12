import { Message } from 'node-nats-streaming'
import { Listener, OrderCreatedEvent, Subjects } from "@ecomtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  queueGroupName = queueGroupName
  readonly subject = Subjects.OrderCreated

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id as string,
      status: data.status,
      userId: data.userId,
      version: data.version,
      price: data.ticket.price
    })
    await order.save()

    msg.ack()
  }
}