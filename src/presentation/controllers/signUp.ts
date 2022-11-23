import { InvalidParamError, MissingParamError } from 'presentation/errors'
import { badRequest, serverError } from 'presentation/helpers'
import { EmailValidator, HttpRequest, HttpResponse, Controller } from 'presentation/protocols'
import { AddAccount } from '../../domain'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}
  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) return badRequest(new InvalidParamError('email'))
      this.addAccount.add({
        name,
        email,
        password
      })
      return {
        statusCode: 200,
        body: 'All right'
      }
    } catch {
      return serverError()
    }
  }
}
