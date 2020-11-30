import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'

// tell typescript there is a signup method in the global NodeJS
// namespace that is only available when running tests
// not best design to use globals but this works for us rn
declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>
    }
  }
}


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
global.signup = async () => {
  const email = 'test@test.com'
  const password = 'password'

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email, password
    })
    .expect(201)

  const cookie = response.get('Set-Cookie')

  return cookie
}