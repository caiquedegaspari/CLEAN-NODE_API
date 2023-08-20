import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { LoadSurveyById } from '../save-survey-result/save-survey-result-controller-protocols'
import {
  HttpRequest,
  InvalidParamError,
  LoadSurveyResult,
  LoadSurveyResultController,
  forbidden,
  mockLoadSurveyById,
  mockLoadSurveyResult,
  ok,
  serverError,
  throwError
} from './load-survey-result-controller-protocols'
import MockDate from 'mockdate'

const mockFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)

  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call loadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockFakeRequest())
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith(mockFakeRequest().params.surveyId)
  })
  it('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(mockFakeRequest())
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  it('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(throwError())
    const res = await sut.handle(mockFakeRequest())
    expect(res).toEqual(serverError(new Error()))
  })
  it('Should call loadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(mockFakeRequest())
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith(mockFakeRequest().params.surveyId)
  })
  it('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockReturnValueOnce(throwError())
    const res = await sut.handle(mockFakeRequest())
    expect(res).toEqual(serverError(new Error()))
  })
  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle(mockFakeRequest())
    expect(res).toEqual(ok(mockSurveyResultModel()))
  })
})
