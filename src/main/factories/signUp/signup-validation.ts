import { Validation } from 'presentation/helpers/validators'
import { CompareFieldsValidation } from 'presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from 'presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from 'presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from 'presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from 'utils'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  const emailValidatorAdapter = new EmailValidatorAdapter()
  validations.push(new EmailValidation('email', emailValidatorAdapter))
  return new ValidationComposite(validations)
}
