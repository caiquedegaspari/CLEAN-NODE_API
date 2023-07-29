import { AccountModel, Decrypter, LoadAccountByToken, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository

  ) {}

  async load (token: string, role?: string | undefined): Promise<AccountModel | null> {
    const accessToken = await this.decrypter.decrypt(token)
    if (accessToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(token, role)
      if (account) return account
    }
    return await Promise.resolve(null)
  }
}
