import { Publisher, OrderCompleteEvent, Subjects } from '@ecomtickets/common'

export class OrderCompletePublisher extends Publisher<OrderCompleteEvent> {
  readonly subject = Subjects.OrderComplete
}