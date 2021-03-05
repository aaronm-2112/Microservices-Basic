import { Message } from "node-nats-streaming";
import {
  BadRequestError,
  CustomError,
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@ecomtest/tickets-common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly queueGroupName = queueGroupName;
  readonly subject = Subjects.TicketUpdate;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    // Find the ticket
    const ticket = await Ticket.findById(data.id);

    // check if it exists
    if (!ticket) {
      const tickets = await Ticket.find({});
      throw new BadRequestError(
        `Here are the tickets that have been created: ${tickets}`
      );
    }
    // Extract the updated ticket data
    const { id, version, title, price, userId, orderId } = data;

    // Update the ticket
    ticket.set({ version, title, price, userId, orderId });

    // Save the ticket
    await ticket.save();

    // ack the message
    msg.ack();
  }
}
