import { ValidationComposite } from 'presentation/helpers/validators/validation-composite'
import { makeLoginValidation } from './login-validation'
import { RequiredFieldValidation } from 'presentation/helpers/validators/required-field-validation'
import { Validation } from 'presentation/helpers/validators'
import { EmailValidator } from 'presentation/protocols/email-validator'
import { EmailValidation } from 'presentation/helpers/validators/email-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  it('Should call ValidationComposite with all Validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})