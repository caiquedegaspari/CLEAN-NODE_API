import { InvalidParamError, MissingParamError } from 'presentation/errors'
import { badRequest, serverError } from 'presentation/helpers'
import { EmailValidator, HttpRequest, HttpResponse, Controller } from 'presentation/protocols'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}
  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) return badRequest(new InvalidParamError('email'))
      return {
        statusCode: 200,
        body: 'All right'
      }
    } catch {
      return serverError()
    }
  }
}
