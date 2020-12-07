import { OrderStatus } from '@ecomtickets/common'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Payment } from '../../models/payment'
import { stripe } from '../../stripe'

jest.mock('../../stripe')

it('returns a 404 when purhcasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'asffas',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)

})

it("returns a 401 when purchasing an order that doesn't belong to the user", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'asffas',
      orderId: order.id
    })
    .expect(401)
})

it('returns a 400 when purhcasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      orderId: order.id,
      token: 'asafsfs'
    })
    .expect(400)
})

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201)

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

  expect(chargeOptions.source).toEqual('tok_visa')
  expect(chargeOptions.amount).toEqual(20 * 100)
  expect(chargeOptions.currency).toEqual('usd')
})

// it('returns a 201 with valid inputs and a payment was added', async () => {
//   const userId = mongoose.Types.ObjectId().toHexString()

//   const order = Order.build({
//     id: mongoose.Types.ObjectId().toHexString(),
//     userId: userId,
//     version: 0,
//     price: 20,
//     status: OrderStatus.Created
//   })
//   await order.save()

//   await request(app)
//     .post('/api/payments')
//     .set('Cookie', global.signup(userId))
//     .send({
//       token: 'tok_visa',
//       orderId: order.id
//     })
//     .expect(201)

//   const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

//   expect(chargeOptions.source).toEqual('tok_visa')
//   expect(chargeOptions.amount).toEqual(20 * 100)
//   expect(chargeOptions.currency).toEqual('usd')

//   const payment = await Payment.findOne({
//     orderId: order.id,
//     stripeId: chargeOptions!.id
//   })

//   expect(payment).not.toBeNull()
// })