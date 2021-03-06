import mongoose from 'mongoose'
import { Order, OrderStatus } from './order'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// this model is going to be different from the ticket model 
// in tickets service so we do not put this in common module
interface TicketAttrs {
  id: string
  title: string
  price: number
}

export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  version: number
  
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
  isReserved(ticket: TicketDoc): Promise<boolean>
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.static('build', (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
  })
})

ticketSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
})

// add a function to the ticket document
// Make sure that the ticket is not already reserved
// Run query to look at all orders. Find an order where the 
// ticket is the ticket we fetched and the orders status is 
// not cancelled. If we find an order from this, that means
// the ticket is reserved.
//@ts-ignore
ticketSchema.static('isReserved', async function (ticket: TicketDoc): Promise<boolean> {
  // this === the ticket document that we called 'isReserved' on
  const existingOrder = await Order.findOne({
    // @ts-ignore
    ticket,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  })


  // if order exists flip it to false then true
  // if order is null flip it to true then flip it to false
  return !!existingOrder
})




const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }

