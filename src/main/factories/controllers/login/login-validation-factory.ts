import { Validation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  const emailValidatorAdapter = new EmailValidatorAdapter()
  validations.push(new EmailValidation('email', emailValidatorAdapter))
  return new ValidationComposite(validations)
}
