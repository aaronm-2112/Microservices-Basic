import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

// tell typescript there is a signup method in the global NodeJS
// namespace that is only available when running tests
// not best design to use globals but this works for us rn
declare global {
  namespace NodeJS {
    interface Global {
      signup(): string[]
    }
  }
}


// tell jest to redirect the real import to the mock we created
// whenever we use NATS in a route
jest.mock('../nats-wrapper')

let mongo: any

// a hook
beforeAll(async () => {
  process.env.JWT_KEY = "asdf"
  process.env.NODE_ENV = "test"
  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

// clean the db data before each test
beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

// by default supertest doesn't manage cookies. 
// this helper function will accommodate for this by 
// signing up a user and returning the cookie.
// the cookie can be set in any follow up requests
global.signup = () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  // build a JWt payload {id, email}
  let payload = { id, email: "test@test.com" }

  // create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // build the session object{ jwt: my_JWT}
  let session = { jwt: token }

  // turn that session into JSON 
  let sessionJSON = JSON.stringify(session)

  // take JSON and encode it as base64
  let base64 = Buffer.from(sessionJSON).toString('base64')

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`]
}