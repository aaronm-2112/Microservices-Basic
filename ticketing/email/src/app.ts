// Plan:
//    1. Create two models: Orders and tickets and all listeners  [WIP]
//    2. Add email to Orders in all services and in Common for all Order Events
//    3. Create the listener in Email service that listens for OrderComplete 
//       -Create an OrderComplete event and then have it send from Orders in a publisher
//       -Send an email to the user with the ticket and order information
//    3.5: Create testes to ensure the listener is functioning properly 
//    4. Allow a user to manually resend a verification email to themselves using the Email service 
//    4.5: Create tests to ensure a user is able to properly manually resend a verificvation email
//    5. Create the infra files
//    6. Add to Skaffold?
//    7. Add service to the CI/CD pipeline 


import express from 'express'
import 'express-async-errors'; //allows synchronous error handling middleware to be called from inside an asynchronous method with throw keyword
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { errorHandler, NotFoundError, currentUser } from '@ecomtickets/common'

const app = express()


// the ingress controller acts as a proxy; this makes it trusted
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
  signed: false,
  // secure: process.env.NODE_ENV !== 'test' -- for when https is added
  secure: false
}))

// middleware that sets the users cookie if they are authenticated
app.use(currentUser)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }