import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '../../main/factories/middlewares/auth-middleware-factory'
import { adaptMidleware } from '../../main/adapters/express-middleware-adapter'

export default (router: Router): void => {
  const adminAuth = adaptMidleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
}
