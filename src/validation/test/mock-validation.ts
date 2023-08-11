import { Validation } from '../validators'

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate = (input: any): Error | null => {
      return null
    }
  }
  const validationStub = new ValidationStub()
  return validationStub
}
