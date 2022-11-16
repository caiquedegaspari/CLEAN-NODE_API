import { MissingParamError } from 'presentation/errors'
import { HttpRequest, HttpResponse } from 'presentation/protocols'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
    return {
      statusCode: 0,
      body: 'All right'
    }
  }
}
