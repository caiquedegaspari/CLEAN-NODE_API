import { MissingParamError } from 'presentation/errors'
import { ValidationComposite } from './validation-composite'
import { Validation } from './validation'

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate = (input: any): Error | null => {
        return new MissingParamError('field')
      }
    }
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
