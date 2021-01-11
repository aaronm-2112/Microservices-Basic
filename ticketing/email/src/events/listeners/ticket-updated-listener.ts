import { Message } from 'node-nats-streaming'
import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from '@ecomtickets/common'
import { queueGroupName } from './queue-group-name'
import { Ticket, TicketDoc } from '../../models/ticket'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly queueGroupName = queueGroupName
  readonly subject = Subjects.TicketUpdate

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // Extract the updated ticket data 
    const { id, version, title, price, userId, orderId } = data

    // Find the ticket 
    const ticket: TicketDoc = await Ticket.findOne({
      _id: id,
      version: version - 1
    })

    // Check if the ticket exists 
    if (!ticket) {
      throw new NotFoundError()
    }

    // Update the ticket
    ticket.set({ version, title, price, userId, orderId })

    // Save the ticket
    await ticket.save()

    // ack the message
    msg.ack()
  }
}

