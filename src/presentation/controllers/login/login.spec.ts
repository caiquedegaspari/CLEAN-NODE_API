import { MissingParamError } from 'presentation/errors'
import { LoginController } from './login'
import { badRequest } from 'presentation/helpers'

describe('Login Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        password: 'any_password'

      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})