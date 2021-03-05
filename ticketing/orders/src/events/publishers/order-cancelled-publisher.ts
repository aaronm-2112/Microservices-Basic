import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@ecomtest/tickets-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
