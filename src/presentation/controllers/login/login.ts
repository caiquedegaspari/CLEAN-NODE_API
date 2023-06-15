import { badRequest, serverError, unauthorized } from 'presentation/helpers'
import { Controller, HttpRequest, HttpResponse, EmailValidator, Authentication } from './login-protocols'
import { InvalidParamError, MissingParamError } from 'presentation/errors'
// import { EmailValidator } from '../signup/signup-protocols'
// import { Authentication } from '../../../domain/usecases'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) return badRequest(new InvalidParamError('email'))

      const acessToken = await this.authentication.auth(email, password)
      if (!acessToken) return unauthorized()
      return { body: {}, statusCode: 200 }
    } catch (err) {
      return serverError(err as Error)
    }
  }
}
