import { Message } from "node-nats-streaming";
import sgMail from "../../send-grid-email-service";
// import the OrderCompleted event
import {
  Listener,
  NotFoundError,
  OrderCompleteEvent,
  OrderStatus,
  Subjects,
} from "@ecomtest/tickets-common";
// import the stan client
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { Ticket, TicketDoc } from "../../models/ticket";
// import the queuegroupname

// setup the listener
export class OrderCompleteListener extends Listener<OrderCompleteEvent> {
  readonly subject = Subjects.OrderComplete;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCompleteEvent["data"], msg: Message) {
    // Extract the orderid, email, and status of the completed order
    const { id, email, status, version } = data;
    // Query for the completed order with mongoose
    const order = await Order.findOne({
      _id: id,
      version: version - 1,
    });

    // Ensure the order exists
    if (!order) {
      throw new NotFoundError();
    }

    // Mark the order as complete
    order.set({ status: OrderStatus.Complete });

    // Save the order
    await order.save();

    // Query for the ticket with the associated orderid and version
    const ticket: TicketDoc = await Ticket.findById(data.id);

    // Create the email data object
    const emailContents = {
      to: `${email}`,
      from: "aaron.marroquin96@gmail.com", // TODO: Make an environment variable
      subject: `Order Confirmation From Ticketing.io For Order ${id}`,
      text: `This is a confirmation for your purchase of ${ticket.title} for $${ticket.price}.`,
    };

    // Provide the email to sendgrid and send the email
    sgMail
      .send(emailContents)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    // Ack the message whether the email failed or succeded
    msg.ack();
  }
}
