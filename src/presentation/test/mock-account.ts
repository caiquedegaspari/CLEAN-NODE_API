import { AccountModel, AddAccount, AddAccountParams, mockFakeAccountModel } from '../controllers/auth/signup/signup-controller-protocols'
import { Authentication, AuthenticationParams } from '../controllers/auth/login/login-controller-protocols'
import { LoadAccountByToken } from '../middlewares/auth-middleware-protocols'
import { AuthenticationModel } from '@/domain/models/authentication'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockFakeAccountModel())
    }
  }
  return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
      return await Promise.resolve({ accessToken: 'any_token', name: 'any name' })
    }
  }
  return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string, role?: string | undefined): Promise<AccountModel | null> {
      return await Promise.resolve(mockFakeAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}
