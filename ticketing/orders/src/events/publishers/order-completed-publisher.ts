import {
  Publisher,
  OrderCompleteEvent,
  Subjects,
} from "@ecomtest/tickets-common";

export class OrderCompletePublisher extends Publisher<OrderCompleteEvent> {
  readonly subject = Subjects.OrderComplete;
}
