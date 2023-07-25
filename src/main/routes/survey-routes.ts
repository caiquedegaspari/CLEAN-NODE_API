import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '../../main/factories/middlewares/auth-middleware-factory'
import { adaptMidleware } from '../../main/adapters/express-middleware-adapter'
import { makeLoadSurveyController } from '../../main/factories/controllers/survey/load-surveys/load-survey-controller-factory'

export default (router: Router): void => {
  const adminAuth = adaptMidleware(makeAuthMiddleware('admin'))
  const auth = adaptMidleware(makeAuthMiddleware())

  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveyController()))
}
