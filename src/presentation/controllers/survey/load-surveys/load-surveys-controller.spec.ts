import { noContent, ok, serverError } from '@/presentation/helpers'
import { LoadSurveys, mockFakeSurveys } from './load-survey-controller-protocols'
import { LoadSurveysController } from './load-surveys-controller'
import MockDate from 'mockdate'
import { throwError } from '@/domain/test/throw-error'
import { mockLoadSurveys } from '@/presentation/test'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const mockRequest = (): LoadSurveysController.Request => ({
  accountId: 'any_id'
})

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpReponse = await sut.handle(mockRequest())
    expect(httpReponse).toEqual(ok(mockFakeSurveys()))
  })

  it('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValue(Promise.resolve([]))
    const httpReponse = await sut.handle(mockRequest())
    expect(httpReponse).toEqual(noContent())
  })

  it('Should return 500 if LoadSurvey throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(throwError())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
