import { LoadAccountByEmailRepository } from 'data/protocols/db/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../add-account/db-add-account-protocols'
import { HashComparer } from 'data/protocols/criptography/hash-comparer'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) await this.hashComparer.compare(authentication.password, account.password)
    return null
  }
}
