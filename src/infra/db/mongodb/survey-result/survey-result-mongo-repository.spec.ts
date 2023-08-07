import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain'

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
        answer: 'any_answer',
        image: 'any_image'
      },
      {
        answer: 'other_answer'
      }
    ],
    date: new Date()
  })
  return MongoHelper.map(res.ops[0])
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  })
  return MongoHelper.map(res.ops[0])
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
      const account = await makeAccount()
      const surveyResult = await sut.save({
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
        surveyId: survey.id
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.id).toBeTruthy()
      expect(surveyResult?.answer).toBe(survey.answers[0].answer)
    })

    it('Should update a survey result if its not new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()
      const res = await surveyResultCollection.insertOne({
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
        surveyId: survey.id
      })
      const surveyResult = await sut.save({
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date(),
        surveyId: survey.id
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.id).toEqual(res.ops[0]._id)
      expect(surveyResult?.answer).toBe(survey.answers[1].answer)
    })
  })
})