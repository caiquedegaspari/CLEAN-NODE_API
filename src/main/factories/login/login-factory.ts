import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from 'presentation/protocols'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'

import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { LogControllerDecorator } from '../../../main/decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../config/env'

export const makeLoginController = (): Controller => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const bcryptAdapter = new BcryptAdapter(salt)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const logMongoRepository = new LogMongoRepository()
  const loginController = new LoginController(dbAuthentication, makeLoginValidation())
  return new LogControllerDecorator(loginController, logMongoRepository)
}
