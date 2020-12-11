import express from 'express'
import 'express-async-errors'; //allows synchronous error handling middleware to be called from inside an asynchronous method with throw keyword
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/signin'
import { signOutRouter } from './routes/signout'
import { signUpRouter } from './routes/signup'
import { errorHandler, NotFoundError } from '@ecomtickets/common'

const app = express()

// the ingress controller acts as a proxy; this makes it trusted
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
  signed: false,
  // secure: process.env.NODE_ENV !== 'test' -- for when https is added
  secure: false
}))

// use routers
app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }