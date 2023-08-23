import { LoadAnswersBySurvey, LoadAnswersBySurveyRepository } from './db-load-answers-by-survey-protocols'

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor (private readonly loadSurveyRepository: LoadAnswersBySurveyRepository) {}
  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result | null> {
    return await this.loadSurveyRepository.loadAnswers(id)
  };
}
