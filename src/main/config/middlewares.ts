import { Express } from 'express'
import { cors } from 'main/middlewares/cors'
import { bodyParser } from '../middlewares/body-parser'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
}
