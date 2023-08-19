import {
  forbidden,
  serverError,
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyResult,
  LoadSurveyById,
  InvalidParamError
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
      await this.loadSurveyResult.load(surveyId)
      return await Promise.resolve({
        body: {},
        statusCode: 200
      })
    } catch (err) {
      return serverError(err as Error)
    }
  }
}
