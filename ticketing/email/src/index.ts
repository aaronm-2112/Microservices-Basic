import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import SendGrid from "@sendgrid/mail"



const start = async () => {
  // console.log("Starting orders service.......")
  // if (!process.env.JWT_KEY) {
  //   throw new Error('JWT_KEY must be defined')
  // }

  // if (!process.env.MONGO_URI) {
  //   throw new Error('MONGO_URI must be defined')
  // }

  // if (!process.env.NATS_CLIENT_ID) {
  //   throw new Error('NATS_CLIENT_ID must be defined')
  // }

  // if (!process.env.NATS_URL) {
  //   throw new Error('NATS_URL must be defined')
  // }

  // if (!process.env.NATS_CLUSTER_ID) {
  //   throw new Error('NATS_CLUSTER_ID must be defined')
  // }

  // try {
  //   await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)

  //   // it would be nice to integrate into our class but that can be dangerous so we don't
  //   natsWrapper.client.on('close', () => {
  //     console.log('NATS connection closed!')
  //     process.exit()
  //   })

  //   process.on('SIGINT', () => natsWrapper.client.close())
  //   process.on('SIGTERM', () => natsWrapper.client.close())



  //   await mongoose.connect(process.env.MONGO_URI, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     useCreateIndex: true
  //   })
  //   console.log("Connected to mongodb")

  // } catch (e) {
  //   console.error(e)
  // }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!")

    if (!process.env.SENDGRID_API_KEY) {
      console.log("API KEY NOT FOUND")
    } else {
      console.log(process.env.SENDGRID_API_KEY)
    }

    SendGrid.setApiKey(process.env.SENDGRID_API_KEY!)
    const msg = {
      to: 'aaron.marroquin96@gmail.com', // Change to your recipient
      from: 'aaron.marroquin96@gmail.com', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    SendGrid
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })

    // SendGrid test 
  })
}

start()