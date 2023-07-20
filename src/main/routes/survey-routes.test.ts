import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey routes', () => {
  beforeAll(async () => {
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
  describe('POST /surveys', () => {
    it('Should return 403 on add survey without access token ', async () => {
      await request(app)
        .post('/api/surveys').send({
          question: 'Question',
          answers: [
            {
              answer: 'answer 1',
              image: 'http://image_name.com'
            },
            {
              answer: 'answer 2'
            }
          ]
        })
        .expect(403)
    })
  })
  it('Should return 204 on add survey with valid access token ', async () => {
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

    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send({
        question: 'Question',
        answers: [
          {
            answer: 'answer 1',
            image: 'http://image_name.com'
          },
          {
            answer: 'answer 2'
          }
        ]
      })
      .expect(204)
  })
})
