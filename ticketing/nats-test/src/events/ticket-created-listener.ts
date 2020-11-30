import { Message, Stan } from 'node-nats-streaming'
import { Listener } from './base-listener'
import { Subjects } from './subjects'
import { TicketCreatedEvent } from './ticket-created-event'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // ensure we cannot change the subject value 
  // (TS won't work without this and we want to ensure it )
  readonly subject = Subjects.TicketCreated
  queueGroupName = 'payments-service'
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data.id)
    console.log('Event data!', data.title)
    console.log('Event data!', data.price)

    msg.ack()
  }

  constructor(client: Stan) {
    super(client)
  }
}