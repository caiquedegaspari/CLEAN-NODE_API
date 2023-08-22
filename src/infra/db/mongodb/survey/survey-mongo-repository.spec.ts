import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { mockAddSurveyParams } from '@/domain/test'
// import FakeObjectId from 'bson-objectid'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  })
  return res.ops[0]._id
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo repository', () => {
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

  describe('add()', () => {
    it('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add({
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
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    it('Should load all surveys on success', async () => {
      const addSurveysModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const accountId = await mockAccountId()
      const result = await surveyCollection.insertMany(addSurveysModels)
      const survey = result.ops[0]
      await surveyResultCollection.insertOne({
        accountId: new ObjectId(accountId),
        surveyId: new ObjectId(survey._id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].didAnswer).toBe(false)
      expect(surveys[1].question).toBe('any_question')
    })

    it('Should load empty list', async () => {
      const sut = makeSut()
      const accountId = await mockAccountId()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    it('Should load survey by id on success', async () => {
      const sut = makeSut()
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
      const survey = await sut.loadById(res.ops[0]._id)
      expect(survey).toBeTruthy()
      expect(survey?.id).toBeTruthy()
    })
  })

  describe('checkById()', () => {
    it('Should return true if survey exists', async () => {
      const sut = makeSut()
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
      const result = await sut.checkById(res.ops[0]._id)
      expect(result).toEqual(true)
    })
    it('Should return false if survey dont exists', async () => {
      const accountId = await mockAccountId()
      const sut = makeSut()
      const result = await sut.checkById(accountId)
      expect(result).toEqual(false)
    })
  })
})
