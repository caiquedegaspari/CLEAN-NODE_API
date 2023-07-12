import { Router } from 'express'
import { makeSignUpController } from '../factories/signUp/signup-factory'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
