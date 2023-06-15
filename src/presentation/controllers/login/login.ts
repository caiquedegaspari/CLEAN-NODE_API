import { badRequest } from 'presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from 'presentation/errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) return badRequest(new MissingParamError('email'))
    if (!httpRequest.body.password) return badRequest(new MissingParamError('password'))

    return { body: {}, statusCode: 200 }
  }
}
