import { LoadAnswersBySurvey } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'
import { LoadSurveys, SurveyModel } from '../controllers/survey/load-surveys/load-survey-controller-protocols'
import { mockFakeSurveys, mockFakeSurvey } from '../middlewares/auth-middleware-protocols'
import { AddSurvey } from '../controllers/survey/add-survey/add-survey-controller-protocols'
import { CheckSurveyById } from '../controllers/survey-result/load-survey-result/load-survey-result-controller-protocols'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurvey.Params): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (accountId: string): Promise<SurveyModel[]> {
      return await Promise.resolve(mockFakeSurveys())
    }
  }
  return new LoadSurveysStub()
}

export const mockLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  class LoadSurveyByIdStub implements LoadAnswersBySurvey {
    async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result | null> {
      return await Promise.resolve([mockFakeSurvey().answers[0].answer, mockFakeSurvey().answers[1].answer])
    }
  }
  return new LoadSurveyByIdStub()
}

export const mockCheckSurveyById = (): CheckSurveyById => {
  class CheckSurveyByIdStub implements CheckSurveyById {
    async checkById (id: string): Promise<CheckSurveyById.Result> {
      return await Promise.resolve(true)
    }
  }
  return new CheckSurveyByIdStub()
}
