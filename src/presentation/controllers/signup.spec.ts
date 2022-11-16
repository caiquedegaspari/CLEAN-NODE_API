import { SignUpController } from './signUp'
import { MissingParamError } from 'presentation/errors'

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    // sut = system under test
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'email@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  it('Should return 400 if no email is provided', () => {
    // sut = system under test
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any name',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  it('Should return 400 if no password is provided', () => {
    // sut = system under test
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'email@email.com',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  it('Should return 400 if no passwordConfirmation is provided', () => {
    // sut = system under test
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'email@email.com',
        password: '123456'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
})
