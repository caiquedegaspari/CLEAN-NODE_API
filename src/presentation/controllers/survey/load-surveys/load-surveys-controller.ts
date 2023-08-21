import { badRequest, noContent, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpResponse, LoadSurveys } from './load-survey-controller-protocols'
import { MissingParamError } from '../../survey-result/load-survey-result/load-survey-result-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      if (!request.accountId) return badRequest(new MissingParamError('accountId'))
      const surveys = await this.loadSurveys.load(request.accountId)
      return surveys.length ? ok(surveys) : noContent()
    } catch (err) {
      return serverError(err as Error)
    }
  };
}

export namespace LoadSurveysController {
  export type Request = {
    accountId: string
  }
}
