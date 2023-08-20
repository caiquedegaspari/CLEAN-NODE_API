import {
  forbidden,
  serverError,
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyResult,
  LoadSurveyById,
  InvalidParamError,
  ok
} from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      const surveyResult = await this.loadSurveyResult.load(surveyId, httpRequest?.accountId as string)
      return ok(surveyResult)
    } catch (err) {
      return serverError(err as Error)
    }
  }
}
