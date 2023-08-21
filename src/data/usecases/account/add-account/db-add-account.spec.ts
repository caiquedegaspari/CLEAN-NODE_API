import { AddAccountRepository, Hasher } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'
import { mockFakeAccountModel, mockFakeAccountParams } from '@/domain/test'
import { throwError } from '@/domain/test/throw-error'
import { mockHasher, mockAddAccountRepository, mockLoadAccountByEmailRepository } from '@/data/test'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValue(Promise.resolve(null))
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockFakeAccountParams())
    expect(encryptSpy).toHaveBeenCalledWith('any_password')
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(throwError())
    const promise = sut.add(mockFakeAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(mockFakeAccountParams())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(throwError())
    const promise = sut.add(mockFakeAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should return true if LoadAccountByEmailRepository returns null', async () => {
    const { sut } = makeSut()
    const isValid = await sut.add(mockFakeAccountParams())
    expect(isValid).toBe(true)
  })

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockFakeAccountModel())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return false if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockFakeAccountModel()))
    const isValid = await sut.add(mockFakeAccountParams())
    expect(isValid).toBe(false)
  })
})
