import { HttpStatusCode } from "@/data/protocols/http/http-response";
import { Authentication, AuthenticationParams } from "../../../domain/usecases/authentication";
import { HttpPostClient } from "../../protocols/http/http-post-client";
import { InvalidCredentialsError } from "@/domain/errors/invalid-credentials-error";
import { UnxepectedError } from "@/domain/errors/unexpected-error";
import { AccountModel } from "@/domain/models/account-model";

export class RemoteAuthentication implements Authentication{
  constructor (
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<AuthenticationParams, AccountModel>
  ) {}
  
  async auth (params: AuthenticationParams): Promise<AccountModel> {
    const httpReponse = await this.httpPostClient.post({
      url: this.url,
      body: params
    })
    switch (httpReponse.statusCode) {
      case HttpStatusCode.ok: return httpReponse.body
      case HttpStatusCode.unauthorized: throw new InvalidCredentialsError()
      default: throw new UnxepectedError()
    }
  }
}