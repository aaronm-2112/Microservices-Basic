import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@ecomtest/tickets-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdate;
}
