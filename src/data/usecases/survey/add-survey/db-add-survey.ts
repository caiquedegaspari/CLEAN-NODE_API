import { AddSurvey } from '@/domain/usecases/survey/add-survey'
import { AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}
  async add (data: AddSurvey.Params): Promise<void> {
    await this.addSurveyRepository.add(data)
    return await Promise.resolve()
  }
}
