import { mockFakeSurvey, mockFakeSurveys } from '@/domain/test'
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository'
import { AddSurveyParams } from '../usecases/survey/add-survey/db-add-survey-protocols'
import { LoadSurveyByIdRepository, SurveyModel } from '../usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { LoadSurveysRepository } from '../protocols/db/survey/load-survey-repository'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockFakeSurvey())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (accountId: string): Promise<SurveyModel[]> {
      return await Promise.resolve(mockFakeSurveys())
    }
  }
  return new LoadSurveysRepositoryStub()
}
