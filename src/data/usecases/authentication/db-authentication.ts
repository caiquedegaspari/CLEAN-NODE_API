import { LoadAccountByEmailRepository } from 'data/protocols/db/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../add-account/db-add-account-protocols'
import { HashComparer } from 'data/protocols/criptography/hash-comparer'
import { TokenGenerator } from 'data/protocols/criptography/token-generator'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        return accessToken
      }
    }
    return null
  }
}
