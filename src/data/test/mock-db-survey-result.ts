import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository'
import { LoadSurveyResultRepository } from '../protocols/db/survey-result/load-survey-result-repository'
import { SaveSurveyResult } from '../usecases/survey-result/save-survey-result/db-save-survey-result-protocols'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResult.Params): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result> {
      return await Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyResultRepositoryStub()
}
