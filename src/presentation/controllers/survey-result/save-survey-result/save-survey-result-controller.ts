import { Controller, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const accountId = httpRequest.accountId as string
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const answers = survey.answers.map(answer => answer.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
        const surveyResult = await this.saveSurveyResult.save({
          surveyId,
          answer,
          date: new Date(),
          accountId
        })
        return ok(surveyResult)
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
