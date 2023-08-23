import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResultRepository {
  loadBySurveyId: (surveyId: string, accountId: string) => Promise<LoadSurveyResultRepository.Result | null>
}

export namespace LoadSurveyResultRepository {
  export type Result = SurveyResultModel
}
