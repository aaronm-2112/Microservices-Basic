import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@ecomtickets/common";
import { Message } from 'node-nats-streaming'
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";


export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
  readonly subject = Subjects.PaymentCreated
  queueGroupName = queueGroupName

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    order.set({ status: OrderStatus.Complete })
    await order.save()

    // TODO: Publish an event that marks the order as updated/complete
    // Why isn't this essential: In this app as is, nothing will ever occur to this order again now that it is completed

    msg.ack()
  }
}