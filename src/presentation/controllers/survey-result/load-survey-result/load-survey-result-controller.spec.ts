import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import {
  CheckSurveyById,
  InvalidParamError,
  LoadSurveyResult,
  LoadSurveyResultController,
  forbidden,
  mockCheckSurveyById,
  mockLoadSurveyResult,
  ok,
  serverError,
  throwError
} from './load-survey-result-controller-protocols'
import MockDate from 'mockdate'

const mockFakeRequest = (): LoadSurveyResultController.Request => ({
  surveyId: 'any_survey_id',
  accountId: 'any_id'
})

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdStub: CheckSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdStub = mockCheckSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(checkSurveyByIdStub, loadSurveyResultStub)

  return {
    sut,
    checkSurveyByIdStub,
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
  it('Should call checkSurveyByIdStub with correct value', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    const checkSurveyByIdSpy = jest.spyOn(checkSurveyByIdStub, 'checkById')
    await sut.handle(mockFakeRequest())
    expect(checkSurveyByIdSpy).toHaveBeenCalledWith(mockFakeRequest().surveyId)
  })
  it('Should return 403 if LoadSurveyById returns false', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest.spyOn(checkSurveyByIdStub, 'checkById').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.handle(mockFakeRequest())
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  it('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest.spyOn(checkSurveyByIdStub, 'checkById').mockReturnValueOnce(throwError())
    const res = await sut.handle(mockFakeRequest())
    expect(res).toEqual(serverError(new Error()))
  })
  it('Should call loadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSurveyResultSpy = jest.spyOn(loadSurveyResultStub, 'load')
    const request = mockFakeRequest()
    await sut.handle(request)
    expect(loadSurveyResultSpy).toHaveBeenCalledWith(request.surveyId, request.accountId)
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
