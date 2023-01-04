import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from 'infra/db/mongodb/helpers/mongo-helper'

describe('SignUp routes', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) throw new Error()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup').send({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword'
      })
      .expect(200)
  })
})
