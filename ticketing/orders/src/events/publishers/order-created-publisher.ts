import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@ecomtest/tickets-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
