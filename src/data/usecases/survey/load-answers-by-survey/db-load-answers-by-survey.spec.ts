import MockDate from 'mockdate'
import { DbLoadAnswersBySurvey, LoadSurveyByIdRepository } from './db-load-answers-by-survey-protocols'
import { mockLoadSurveyByIdRepository } from '@/data/test'
import { mockFakeSurvey } from '@/domain/test'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadAnswersBySurvey', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadSurveyByIdRepository', async () => {
    const { loadSurveyByIdRepositoryStub, sut } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadAnswers('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return [] if LoadSurveyByIdRepository returns null', async () => {
    const { loadSurveyByIdRepositoryStub, sut } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValue(Promise.resolve(null))
    const answers = await sut.loadAnswers('any_id')
    expect(answers).toEqual([])
  })

  it('Should return answers on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.loadAnswers('any_id')
    expect(surveys).toEqual([mockFakeSurvey().answers[0].answer, mockFakeSurvey().answers[1].answer])
  })
  it('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject((new Error())))
    const promise = sut.loadAnswers('any_id')
    await expect(promise).rejects.toThrow()
  })
})
