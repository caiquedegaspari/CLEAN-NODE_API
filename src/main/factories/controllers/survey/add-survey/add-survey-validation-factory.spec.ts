import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { ValidationComposite, Validation, RequiredFieldValidation } from '@/validation/validators'

jest.mock('@/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  it('Should call ValidationComposite with all Validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
