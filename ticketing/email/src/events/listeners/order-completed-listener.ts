import { Message } from 'node-nats-streaming'
import sgMail from '@sendgrid/mail'
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

    // TODO: Set the key elsewhere 
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!))

    const emailContents = {
      to: 'aaron.marroquin96@gmail.com', // Change to your recipient
      from: 'aaron.marroquin96@gmail.com', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    sgMail
      .send(emailContents)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })

    msg.ack()
  }

}