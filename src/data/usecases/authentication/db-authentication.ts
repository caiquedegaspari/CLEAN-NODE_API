import { LoadAccountByEmailRepository } from 'data/protocols/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../add-account/db-add-account-protocols'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return ''
  }
}
