import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel, LoadAccountByToken } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) {}

  async load (token: string, role?: string | undefined): Promise<AccountModel | null> {
    await this.decrypter.decrypt(token)
    return await Promise.resolve(null)
  }
}
