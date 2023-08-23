import { LoadSurveyResultRepository } from '../load-survey-result/db-load-survey-result-protocols'
import { SaveSurveyResult, SaveSurveyResultRepository } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResult: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result | null> {
    await this.saveSurveyResultRepository.save(data)
    const surveyResult = await this.loadSurveyResult.loadBySurveyId(data.surveyId, data.accountId)
    return surveyResult
  };
}
