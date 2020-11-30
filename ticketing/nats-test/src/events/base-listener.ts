import { Message, Stan } from 'node-nats-streaming'
import { Subjects } from './subjects'

interface Event {
  subject: Subjects
  data: any
}


export abstract class Listener<T extends Event> {
  abstract subject: T['subject']
  abstract queueGroupName: string
  abstract onMessage(data: T['data'], msg: Message): void
  private client: Stan
  protected ackWait = 5 * 1000 // 5 second default

  constructor(client: Stan) {
    this.client = client
  }

  subscriptionOptions() {
    return this.client.subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName) // rarely want our QG and Durable Subscription names to be different
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    )

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message received: ${this.subject} / ${this.queueGroupName}`
      )

      const parsedData = this.parseMessage(msg)

      this.onMessage(parsedData, msg)
    })
  }

  parseMessage(msg: Message) {
    const data = msg.getData()
    return typeof data === 'string'
      ? JSON.parse(data) //parse a string
      : JSON.parse(data.toString('utf8')) // parse a buffer
  }
}


// const options = stan.subscriptionOptions()
// .setManualAckMode(true)
// .setDeliverAllAvailable() // send all the previous events
// .setDurableName('accounting-service') //track all events sent to QG

// const subscription = stan.subscribe(
// 'ticket:created',
// 'queue-group-name', // do not dump the durable name and ensure all events only go to one service at a time in the QG
// options
// )