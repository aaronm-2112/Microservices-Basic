import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from "@ecomtest/tickets-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
