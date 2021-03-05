import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@ecomtest/tickets-common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
