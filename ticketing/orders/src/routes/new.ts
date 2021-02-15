import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest, currentUser } from '@ecomtickets/common'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 1 * 60


// custom: determines if user has a valid mongoId. Couples this route to other services. Can delete if planning on using other DBs
router.post('/api/orders', requireAuth, [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided')
], validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    // Find the ticket the user is trying to order in the DB
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    // Check if the ticket has already been reserved
    const isReserved = await Ticket.isReserved(ticket)
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    // Calculate an expiration date for this order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // get the current user email
    const email = req.currentUser!.email


    // Build the order and save it to the database 
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      email,
      ticket
    })
    await order.save()

    // Publish an event saying that an order was created 
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id as string,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id as string,
        price: ticket.price
      }
    })

    res.status(201).send(order)
  })

export { router as newOrderRouter }