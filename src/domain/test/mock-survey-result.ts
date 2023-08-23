import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResult } from '../usecases/survey-result/save-survey-result'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }, {
    answer: 'other_answer',
    count: 0,
    percent: 0,
    image: 'any_image',
    isCurrentAccountAnswer: false
  }],
  date: new Date()
})

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'anyQuestion',
  date: new Date()
})
