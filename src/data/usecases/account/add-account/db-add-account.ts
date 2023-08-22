import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'
import { Hasher, AddAccount, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    let isValid: boolean = false
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      isValid = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    }
    return isValid
  }
}
