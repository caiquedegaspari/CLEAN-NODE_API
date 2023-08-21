import { throwError } from '@/domain/test/throw-error'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from './auth-middleware-protocols'
import { mockLoadAccountByToken } from '../test'
const mockFakeRequest = (): AuthMiddleware.Request => ({
  accessToken: 'any_token'
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth middleware', () => {
  it('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  it('Should call LoadAccountByToken with correct access token', async () => {
    const role = 'any_role'
    const { loadAccountByTokenStub, sut } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(mockFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })
  it('Should return 403 if loadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValue(Promise.resolve(null))
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  it('Should return 200 if loadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })
  it('Should return 500 if loadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValue(throwError())
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
