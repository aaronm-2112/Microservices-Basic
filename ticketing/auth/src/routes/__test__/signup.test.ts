import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful signup', () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: 'password'
    })
    .expect(201)
})

it('returns a 400 with an invalid email', () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com",
      password: 'password'
    })
    .expect(400)
})

it('returns a 400 with an invalid password', () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@testtt.com",
      password: '1'
    })
    .expect(400)
})

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: 'test@test.com' })
    .expect(400)

  await request(app)
    .post("/api/users/signup")
    .send({ password: '123345' })
    .expect(400)
})

it('disallows duplicate emails', async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: 'password'
    })
    .expect(201)

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: 'password'
    })
    .expect(400)
})

// fails b/c supertest makes http calls but cookie wants https env
// to get around this, change secure cookie to false when testing
// with envrionment variables in the app.ts file
it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: 'password'
    })
    .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined()
})