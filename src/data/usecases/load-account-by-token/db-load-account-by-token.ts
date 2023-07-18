import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel, LoadAccountByToken } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository

  ) {}

  async load (token: string, role?: string | undefined): Promise<AccountModel | null> {
    const accessToken = await this.decrypter.decrypt(token)
    if (accessToken) {
      await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    }
    return await Promise.resolve(null)
  }
}
