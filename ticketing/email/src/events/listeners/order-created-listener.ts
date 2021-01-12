import { Message } from 'node-nats-streaming'
import { Listener, OrderCreatedEvent, Subjects } from '@ecomtickets/common'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'
import { Ticket, TicketDoc } from '../../models/ticket'


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly queueGroupName = queueGroupName
  readonly subject = Subjects.OrderCreated

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

    // Find the ticket that the order is reserving
    const ticket: TicketDoc = await Ticket.findById(data.ticket.id)

    // If no ticket, throw error 
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id })

    // Save the ticket 
    await ticket.save()

    // Extract the Order data 
    const { id, userId, version, status } = data

    // Create the Order 
    const order = await Order.build({
      id,
      userId,
      status,
      version,
      ticket
    })

    // save the order 
    await order.save()

    // ack the message
    msg.ack()
  }
}