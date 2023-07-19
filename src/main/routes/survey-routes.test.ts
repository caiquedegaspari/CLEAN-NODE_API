import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection

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
})
