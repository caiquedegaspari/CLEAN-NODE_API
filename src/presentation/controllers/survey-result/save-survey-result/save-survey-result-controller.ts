import { Controller, HttpResponse, LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, answer, accountId } = request
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

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
    answer: string
  }
}
