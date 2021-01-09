import mongoose from 'mongoose'
import { OrderStatus } from '@ecomtickets/common'
import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

export { OrderStatus }

interface OrderAttrs {
  id: string
  userId: string
  status: OrderStatus
  ticket: TicketDoc // used for refs
  email: string
  version: number
}

interface OrderDoc extends mongoose.Document {
  userId: string
  status: OrderStatus
  ticket: TicketDoc
  version: number
  email: string
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus), // has to be one of the enums
    default: OrderStatus.Created
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  },
  email: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

// order of statics using build and creating the model matters
orderSchema.static('build', (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    userId: attrs.userId,
    status: attrs.status,
    email: attrs.email,
    ticket: attrs.ticket
  })
})


const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)


export { Order }