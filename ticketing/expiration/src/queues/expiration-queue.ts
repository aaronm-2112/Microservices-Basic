import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-event'
import { natsWrapper } from '../nats-wrapper'


interface Payload {
  orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  }
})

// processing step occurs after receiving a job notification from Redis
expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
})

export { expirationQueue }