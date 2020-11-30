import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

console.clear()

// aka client
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
})

stan.on('connect', async () => {
  console.log('Publisher connected to NATS')

  const publisher = new TicketCreatedPublisher(stan)
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20
    })
  } catch (err) {
    console.error(err)
  }

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20
  // })

  // // an event can also be called a message
  // stan.publish('ticket:created', data, () => {
  //   // invoked after the data has been published
  //   console.log('Event published')
  // })



})