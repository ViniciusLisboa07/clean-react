import { InvalidCredentialsError } from "@/domain/errors/invalid-credentials-error"
import { mockAuthentication } from "../../../domain/test/mock-authentication"
import { HttpPostClientSpy } from "../../test/mock-http-client"
import { RemoteAuthentication } from "./remote-authentication"
import faker from 'faker'
import { HttpStatusCode } from "@/data/protocols/http/http-response"
import { UnxepectedError } from "@/domain/errors/unexpected-error"
import { AuthenticationParams } from "@/domain/usecases/authentication"
import { AccountModel } from "@/domain/models/account-model"

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
}

const makeSut = (url:string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
  const sut = new RemoteAuthentication(url, httpPostClientSpy)

  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.auth(mockAuthentication())
    expect(httpPostClientSpy.url).toEqual(url)
  })

  test('Should call HttpPostClient with correct Body', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const AuthenticationParams = mockAuthentication()
    await sut.auth(AuthenticationParams)
    expect(httpPostClientSpy.body).toEqual(AuthenticationParams)
  })

  test('Should throw InvalidCredentialsError if HttpPostClient returns 401', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should throw UnxepectedError if HttpPostClient returns 400', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnxepectedError())
  })

  test('Should throw UnxepectedError if HttpPostClient returns 500', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnxepectedError())
  })

  test('Should throw UnxepectedError if HttpPostClient returns 404', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnxepectedError())
  })
})