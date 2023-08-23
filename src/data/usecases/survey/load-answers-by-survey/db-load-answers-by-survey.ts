import { LoadAnswersBySurvey, LoadSurveyByIdRepository } from './db-load-answers-by-survey-protocols'

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor (private readonly loadSurveyRepository: LoadSurveyByIdRepository) {}
  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result | null> {
    const survey = await this.loadSurveyRepository.loadById(id)
    return survey?.answers.map((a) => a.answer) ?? []
  };
}
