import { SaveSurveyResultController } from './save-survey-result-controller'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { LoadAnswersBySurvey, SaveSurveyResult } from './save-survey-result-controller-protocols'
import MockDate from 'mockdate'
import { throwError } from '@/domain/test/throw-error'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { mockLoadAnswersBySurvey, mockSaveSurveyResult } from '@/presentation/test'

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurveyStub: LoadAnswersBySurvey
  saveSurveyResultStub: SaveSurveyResult
}

const mockFakeRequest = (): SaveSurveyResultController.Request => ({
  surveyId: 'any_id',
  answer: 'any_answer',
  accountId: 'any_account_id'
})

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyStub = mockLoadAnswersBySurvey()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadAnswersBySurveyStub, saveSurveyResultStub)
  return {
    sut,
    loadAnswersBySurveyStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers')
    const request = mockFakeRequest()
    await sut.handle(request)
    expect(loadByIdSpy).toHaveBeenCalledWith(request.surveyId)
  })

  it('Should return 403 if LoadAnswersBySurvey returns null', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockReturnValueOnce(Promise.resolve([]))
    const res = await sut.handle(mockFakeRequest())
    expect(res).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockReturnValueOnce(throwError())
    const res = await sut.handle(mockFakeRequest())
    expect(res).toEqual(serverError(new Error()))
  })

  it('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const res = await sut.handle({
      surveyId: 'any_id',
      answer: 'wrong_answer',
      accountId: 'any_account_id'
    })
    expect(res).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const request = mockFakeRequest()
    await sut.handle(request)
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_id',
      accountId: 'any_account_id',
      date: new Date(),
      answer: request.answer
    })
  })

  it('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(throwError())
    const res = await sut.handle(mockFakeRequest())
    expect(res).toEqual(serverError(new Error()))
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle(mockFakeRequest())
    expect(res).toEqual(ok(mockSurveyResultModel()))
  })
})
