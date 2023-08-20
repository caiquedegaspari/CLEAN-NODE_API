import { badRequest, noContent, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-survey-controller-protocols'
import { MissingParamError } from '../../survey-result/load-survey-result/load-survey-result-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.accountId) return badRequest(new MissingParamError('accountId'))
      const surveys = await this.loadSurveys.load(httpRequest.accountId)
      return surveys.length ? ok(surveys) : noContent()
    } catch (err) {
      return serverError(err as Error)
    }
  };
}
