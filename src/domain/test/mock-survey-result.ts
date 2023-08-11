import { SurveyResultModel } from '../models/survey-result'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'anyQuestion',
  date: new Date()
})

export const mockFakeSurveyResultData = (): Omit<SurveyResultModel, 'id'> => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'anyQuestion',
  date: new Date()
})
