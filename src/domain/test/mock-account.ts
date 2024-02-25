import { AccountModel } from "../models/account-model";
import { AuthenticationParams } from "../usecases/authentication";
import faker from 'faker'

export const mockAuthentication = (): AuthenticationParams => ({
  email: 'any_email',
  password: 'any_password'
})

export const mockAccountModel = (): AccountModel => ({
  accessToken : faker.random.uuid()
})