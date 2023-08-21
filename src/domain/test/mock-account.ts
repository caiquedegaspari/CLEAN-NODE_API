import { AccountModel } from '../models'
import { AddAccount, AuthenticationParams } from '../usecases'

export const mockFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

export const mockFakeAccountParams = (): AddAccount.Params => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockFakeAuthentication = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
