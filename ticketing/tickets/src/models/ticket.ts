import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
  title: string
  price: number
  userId: string
}

interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
  version: number // add a version prop to the interface for concurrency control
  orderId?: string
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String, // mongoose uses this not TS
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: String
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

// add optimistic version control to avoid concurrency issues
ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }