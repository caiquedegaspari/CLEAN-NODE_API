import {
  loginPath,
  surveyResultPath,
  signUpPath,
  surveyPath
} from './paths/'

export default {
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath
  }
}
