import { SaveSurveyResultController } from './save-survey-result-controller'
import { forbidden, serverError } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { HttpRequest, SurveyResultModel, SurveyModel, LoadSurveyById, SaveSurveyResult, SaveSurveyResultModel } from './save-survey-result-controller-protocols'
import MockDate from 'mockdate'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
  surveyId: 'any_survey_id'
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  date: new Date(),
  answers: [
    { answer: 'any_answer' }
  ],
  question: 'any_question'
})

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel | null> {
      return await Promise.resolve(makeFakeSurveyResult())
    }
  }
  return new SaveSurveyResultStub()
}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return await Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
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
  it('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(loadByIdSpy).toHaveBeenCalledWith(request.params.surveyId)
  })

  it('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const res = await sut.handle(makeFakeRequest())
    expect(res).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const res = await sut.handle(makeFakeRequest())
    expect(res).toEqual(serverError(new Error()))
  })

  it('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const res = await sut.handle({
      params: {
        surveyId: 'any_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    })
    expect(res).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_id',
      accountId: 'any_account_id',
      date: new Date(),
      answer: request.body.answer
    })
  })

  it('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const res = await sut.handle(makeFakeRequest())
    expect(res).toEqual(serverError(new Error()))
  })
})
