import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@ecomtest/tickets-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
