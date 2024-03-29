import { HttpStatusCode, HttpPostClient} from "@/data/protocols/http";
import { Authentication, AuthenticationParams } from "../../../domain/usecases";
import { InvalidCredentialsError, UnxepectedError } from "@/domain/errors";
import { AccountModel } from "@/domain/models";

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