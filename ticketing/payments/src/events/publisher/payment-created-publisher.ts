import { Publisher, PaymentCreatedEvent, Subjects } from "@ecomtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>  {
  readonly subject = Subjects.PaymentCreated
}