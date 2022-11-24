import { SignUpController } from './signUp'
import { MissingParamError, InvalidParamError, ServerError } from 'presentation/errors'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from './signup-protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      return await new Promise((resolve) => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  // versão mockada de email validator
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', async () => {
    // sut = system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'email@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', async () => {
    // sut = system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', async () => {
    // sut = system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'email@email.com',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'email@email.com',
        password: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if no passwordConfirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'email@email.com',
        password: '123456',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'invalid_email@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any name',
      email: 'any_email@email.com',
      password: '123456'
    })
  })

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })
  })
})
