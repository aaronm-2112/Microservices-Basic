import Stripe from 'stripe'

// a single instance of the Stripe sdk than any module can import
export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2020-08-27'
})

