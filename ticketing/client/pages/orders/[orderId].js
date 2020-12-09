import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => { Router.push('/orders') }
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    // so we do not wait 1 second for setinterval to calculate time
    findTimeLeft()

    // get id of the intervale we created
    const timerId = setInterval(findTimeLeft, 1000)

    // invoked when a user leaves the page
    return () => {
      clearInterval(timerId)
    }
  }, [])

  if (timeLeft < 0) {
    return <div>Order expired</div>
  }

  // TODO: Make the publishable key an env variable
  //       Next handles env vars strangely so check the docs
  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={
          ({ id }) => {
            doRequest({ token: id })
          }
        }
        stripeKey="pk_test_51HvmuhCefqa64yPRzVTs7RcryYfwBvoT7GwQ2tZrNA7LdeZI3Lhte1tysdFqpjEjW5oytB2rdJbIWO9XgrY9OdBh00mTGlAekx"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}


OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }

}


export default OrderShow