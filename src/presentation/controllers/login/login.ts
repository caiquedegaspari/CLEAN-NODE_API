import { badRequest } from 'presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from 'presentation/errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    //
    return badRequest(new MissingParamError('email'))
  }
}
