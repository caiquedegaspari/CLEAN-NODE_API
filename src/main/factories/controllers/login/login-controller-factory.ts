import { makeLogControllerDecorator } from 'main/factories/decorators/log-controller-decorator-factory'
import { LoginController } from '../../../../presentation/controllers/auth/login/login-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthentication } from 'main/factories/usecases/authentication/db-authentication-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}
