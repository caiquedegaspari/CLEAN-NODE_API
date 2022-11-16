import { MissingParamError } from 'presentation/errors'
import { badRequest } from 'presentation/helpers'
import { HttpRequest, HttpResponse } from 'presentation/protocols'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) return badRequest(new MissingParamError('name'))
    if (!httpRequest.body.email) return badRequest(new MissingParamError('email'))

    return {
      statusCode: 200,
      body: 'All right'
    }
  }
}
