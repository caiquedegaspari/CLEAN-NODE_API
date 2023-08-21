import { MissingParamError } from '@/presentation/errors'
import { LoginController } from './login-controller'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { Authentication } from './login-controller-protocols'
import { Validation } from '../signup/signup-controller-protocols'
import { throwError } from '@/domain/test/throw-error'
import { mockValidation, mockAuthentication } from '@/presentation/test'

const mockFakeRequest = (): LoginController.Request => ({
  email: 'any_email',
  password: 'any_password'
})

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const validationStub = mockValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('Login Controller', () => {
  it('Sould authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(mockFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email', password: 'any_password' })
  })

  it('Sould return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))

    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it('Sould return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(throwError())
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Sould return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token', name: 'any name' }))
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = mockFakeRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
