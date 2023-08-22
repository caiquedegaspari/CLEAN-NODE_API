import MockDate from 'mockdate'
import { DbCheckSurveyById } from './db-check-survey-by-id'
import { CheckSurveyByIdRepository } from './db-check-survey-by-id-protocols'
import { mockCheckSurveyByIdRepository } from '../../survey-result/load-survey-result/db-load-survey-result-protocols'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositoryStub: CheckSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositoryStub = mockCheckSurveyByIdRepository()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryStub)
  return {
    sut,
    checkSurveyByIdRepositoryStub
  }
}

describe('DbCheckSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call CheckSurveyByIdRepository', async () => {
    const { checkSurveyByIdRepositoryStub, sut } = makeSut()
    const checkByIdSpy = jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById')
    await sut.checkById('any_id')
    expect(checkByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut()
    const exists = await sut.checkById('any_id')
    expect(exists).toEqual(true)
  })

  it('Should return false if CheckSurveyByIdRepository returns true', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockReturnValueOnce(Promise.resolve(false))
    const exists = await sut.checkById('any_id')
    expect(exists).toEqual(false)
  })

  it('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockReturnValueOnce(Promise.reject((new Error())))
    const promise = sut.checkById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
