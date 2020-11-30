import { Publisher, Subjects, TicketCreatedEvent } from '@ecomtickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated
}