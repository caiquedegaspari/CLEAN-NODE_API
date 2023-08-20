import MockDate from 'mockdate'
import { throwError } from '@/domain/test'
import { DbLoadSurveyResult, LoadSurveyResultRepository, mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository } from './db-load-survey-result-protocols'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { LoadSurveyByIdRepository } from '../../survey/load-survey-by-id/db-load-survey-by-id-protocols'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

let surveyId: string
let accountId: string

describe('DbLoadSurveyResult usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  beforeEach(() => {
    surveyId = 'any_survey_id'
    accountId = 'any_id'
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load(surveyId, accountId)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyId, accountId)
  })

  it('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(throwError())
    const promise = sut.load(surveyId, accountId)
    await expect(promise).rejects.toThrow()
  })

  it('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load(surveyId, accountId)
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  it('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    await sut.load(surveyId, accountId)
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith(surveyId)
  })

  it('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))

    const surveyResult = await sut.load(surveyId, accountId)
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
