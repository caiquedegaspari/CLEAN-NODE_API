import { Validation } from 'presentation/helpers/validators'
import { EmailValidation } from 'presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from 'presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from 'presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from 'utils'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  const emailValidatorAdapter = new EmailValidatorAdapter()
  validations.push(new EmailValidation('email', emailValidatorAdapter))
  return new ValidationComposite(validations)
}
