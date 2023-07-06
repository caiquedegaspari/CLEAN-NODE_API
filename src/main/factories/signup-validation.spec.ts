import { ValidationComposite } from 'presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'
import { RequiredFieldValidation } from 'presentation/helpers/validators/required-field-validation'
import { Validation } from 'presentation/helpers/validators'
import { CompareFieldsValidation } from 'presentation/helpers/validators/compare-fields-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  it('Should call ValidationComposite with all Validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
