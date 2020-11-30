import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketCreatedEvent } from '@ecomtickets/common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from '../listeners/queue-group-name'

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated
  readonly queueGroupName = queueGroupName

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id } = data

    const ticket = Ticket.build({
      id, title, price
    })
    await ticket.save()

    msg.ack()
  }
}
