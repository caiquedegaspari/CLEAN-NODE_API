import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SurveyModel } from '@/domain/models/survey'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer_1',
        image: 'any_image'
      },
      {
        answer: 'other_answer_2'
      },
      {
        answer: 'other_answer_3'
      }
    ],
    date: new Date()
  })
  return MongoHelper.map(res.ops[0])
}

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  })
  return res.ops[0]._id
}

describe('Survey Result Mongo repository', () => {
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
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    it('Should add a survey result if its new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const accountId = await mockAccountId()
      await sut.save({
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
        surveyId: survey.id
      })
      const surveyResult = await surveyResultCollection.findOne({
        accountId,
        surveyId: survey.id
      })
      expect(surveyResult).toBeTruthy()
    })

    it('Should update a survey result if its not new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const accountId = await mockAccountId()
      await surveyResultCollection.insertOne({
        accountId: new ObjectId(accountId),
        surveyId: new ObjectId(survey.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      await sut.save({
        accountId,
        answer: survey.answers[1].answer,
        date: new Date(),
        surveyId: survey.id
      })
      const surveyResult = await surveyResultCollection.find({
        accountId,
        surveyId: survey.id
      }).toArray()
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })
  describe('loadSurveyById', () => {
    it('Should load survey result', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      await surveyResultCollection.insertMany([{
        accountId: new ObjectId(accountId),
        surveyId: new ObjectId(survey.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        accountId: new ObjectId(accountId2),
        surveyId: new ObjectId(survey.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }])
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(100)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[1].count).toBe(0)
      expect(surveyResult?.answers[1].percent).toBe(0)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    it('Should load survey result 2', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      const accountId3 = await mockAccountId()

      await surveyResultCollection.insertMany([{
        accountId: new ObjectId(accountId),
        surveyId: new ObjectId(survey.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        accountId: new ObjectId(accountId2),
        surveyId: new ObjectId(survey.id),
        answer: survey.answers[1].answer,
        date: new Date()
      },
      {
        accountId: new ObjectId(accountId3),
        surveyId: new ObjectId(survey.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }
      ])
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId2)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(67)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[1].count).toBe(1)
      expect(surveyResult?.answers[1].percent).toBe(33)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    it('Should load survey result 2', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      const accountId3 = await mockAccountId()

      await surveyResultCollection.insertMany([{
        accountId: new ObjectId(accountId),
        surveyId: new ObjectId(survey.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        accountId: new ObjectId(accountId2),
        surveyId: new ObjectId(survey.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }
      ])
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId3)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].count).toBe(1)
      expect(surveyResult?.answers[0].percent).toBe(50)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult?.answers[1].count).toBe(1)
      expect(surveyResult?.answers[1].percent).toBe(50)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    it('Should return null if there is no survey result', async () => {
      const accountId = await mockAccountId()
      const sut = makeSut()
      const survey = await makeSurvey()
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId)
      expect(surveyResult).toBeNull()
    })
  })
})
