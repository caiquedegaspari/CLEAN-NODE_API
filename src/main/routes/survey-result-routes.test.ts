import request from 'supertest'
import app from '../config/app'
// import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
// import { Collection } from 'mongodb'
// import { sign } from 'jsonwebtoken'
// import env from '../config/env'

/* let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    role: 'admin'
  })
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)

  await accountCollection.updateOne({ _id: id }, {
    $set: { accessToken }
  })
  return accessToken
}
 */
describe('Survey routes', () => {
/*   beforeAll(async () => {
    if (!process.env.MONGO_URL) throw new Error()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
 */ describe('PUT /surveys/:surveyId/result', () => {
    it('Should return 403 on save survey result without access token ', async () => {
      await request(app)
        .put('/api/surveys/any_id/results').send({
          answer: 'any_answer'
        })
        .expect(403)
    })
  })
})
