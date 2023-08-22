import { LoadSurveyById, LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyRepository: LoadSurveyByIdRepository) {}
  async loadById (id: string): Promise<LoadSurveyById.Result | null> {
    return await this.loadSurveyRepository.loadById(id)
  };
}
