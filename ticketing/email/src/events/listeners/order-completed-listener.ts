import { Message } from 'node-nats-streaming'
// import the OrderCompleted event
import { Listener, NotFoundError, OrderCompleteEvent, Subjects } from '@ecomtickets/common'
// import the stan client 
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'
import { Ticket, TicketDoc } from '../../models/ticket'
// import the queuegroupname

// setup the listener 
export class OrderCompleteListener extends Listener<OrderCompleteEvent> {
  readonly subject = Subjects.OrderComplete
  readonly queueGroupName = queueGroupName

  async onMessage(data: OrderCompleteEvent['data'], msg: Message) {

    // Extract the orderid, email, and status of the completed order
    const { id, email, status, version } = data
    // Query for the completed order with mongoose
    const order = await Order.findOne({
      _id: id,
      version: version - 1
    })

    // Ensure the order exists 
    if (!order) {
      throw new NotFoundError()
    }

    // Mark the order as complete 
    order.set({ status: Subjects.OrderComplete })

    // Save the order
    await order.save()

    // Query for the ticket with the associated orderid and version 
    const ticket: TicketDoc = await Ticket.findById(data.id)

    //    create an email data object 
    //    provide the email to sendgrid and send the email  

    msg.ack()
  }

}