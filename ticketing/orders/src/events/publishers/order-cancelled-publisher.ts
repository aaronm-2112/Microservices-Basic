import { Publisher, OrderCancelledEvent, Subjects } from '@ecomtickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
