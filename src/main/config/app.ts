import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import express from 'express'
import setupSwagger from './swagger'
import setupStaticFiles from './static-files'
import setupApolloServer from './apollo-server'

const app = express()
// eslint-disable-next-line @typescript-eslint/no-floating-promises
setupApolloServer(app)
setupStaticFiles(app)
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)
export default app
