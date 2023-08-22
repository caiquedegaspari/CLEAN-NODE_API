import { CheckSurveyById, CheckSurveyByIdRepository } from './db-check-survey-by-id-protocols'

export class DbCheckSurveyById implements CheckSurveyById {
  constructor (private readonly checkSurveyRepository: CheckSurveyByIdRepository) {}
  async checkById (id: string): Promise<CheckSurveyById.Result> {
    return await this.checkSurveyRepository.checkById(id)
  };
}
