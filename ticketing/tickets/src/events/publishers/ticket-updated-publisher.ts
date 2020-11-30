import { Publisher, Subjects, TicketUpdatedEvent } from '@ecomtickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdate
}