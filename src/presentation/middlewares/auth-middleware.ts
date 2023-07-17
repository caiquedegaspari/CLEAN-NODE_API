import { forbidden } from 'presentation/helpers'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { AccessDeniedError } from 'presentation/errors'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError())
  }
}
