import { LoadAccountByEmailRepository } from 'data/protocols/db/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../add-account/db-add-account-protocols'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return null
  }
}
