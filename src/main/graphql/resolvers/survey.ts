import { adaptResolver } from '@/main/adapters/apollo-server-resolver-adapter'
import { makeLoadSurveyController } from '@/main/factories/controllers/survey/load-surveys/load-survey-controller-factory'

export default {
  Query: {
    surveys: async (parent: any, args: any, context: any) => await adaptResolver(makeLoadSurveyController(), args, context)
  }
}
