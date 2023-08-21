import {
  forbidden,
  serverError,
  Controller,
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

  async handle (request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId } = request
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      const surveyResult = await this.loadSurveyResult.load(surveyId, request.accountId)
      return ok(surveyResult)
    } catch (err) {
      return serverError(err as Error)
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
  }
}
