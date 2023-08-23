import MockDate from 'mockdate'
import { DbLoadAnswersBySurvey, LoadAnswersBySurveyRepository } from './db-load-answers-by-survey-protocols'
import { mockLoadAnswersBySurveydRepository } from '@/data/test'
import { mockFakeSurvey } from '@/domain/test'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositoryStub: LoadAnswersBySurveyRepository
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositoryStub = mockLoadAnswersBySurveydRepository()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositoryStub)
  return {
    sut,
    loadAnswersBySurveyRepositoryStub
  }
}

describe('DbLoadAnswersBySurvey', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadAnswersBySurveyRepository', async () => {
    const { loadAnswersBySurveyRepositoryStub, sut } = makeSut()
    const loadAnswersSpy = jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers')
    await sut.loadAnswers('any_id')
    expect(loadAnswersSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return [] if LoadAnswersBySurveyRepository returns []', async () => {
    const { loadAnswersBySurveyRepositoryStub, sut } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockReturnValue(Promise.resolve([]))
    const answers = await sut.loadAnswers('any_id')
    expect(answers).toEqual([])
  })

  it('Should return answers on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.loadAnswers('any_id')
    expect(surveys).toEqual([mockFakeSurvey().answers[0].answer, mockFakeSurvey().answers[1].answer])
  })
  it('Should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockReturnValueOnce(Promise.reject((new Error())))
    const promise = sut.loadAnswers('any_id')
    await expect(promise).rejects.toThrow()
  })
})
