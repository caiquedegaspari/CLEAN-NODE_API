import { Encrypter } from "data/protocols";
import { AccountModel, AddAccount, AddAccountModel } from "../../../domain";

export class DbAddAccount implements AddAccount {
  
  constructor(private readonly encrypter: Encrypter) {}
  
  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise((resolve) => resolve({
      id: '1',
      email: '',
      name: '',
      password: ''
    }))
  }
}