import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel | null> {
      return await Promise.resolve(mockSurveyResultModel())
    }
  }
  return new SaveSurveyResultStub()
}
