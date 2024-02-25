import { HttpStatusCode } from "@/data/protocols/http/http-response";
import { AuthenticationParams } from "../../../domain/usecases/authentication";
import { HttpPostClient } from "../../protocols/http/http-post-client";
import { InvalidCredentialsError } from "@/domain/errors/invalid-credentials-error";

export class RemoteAuthentication {
  constructor (
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient
  ) {}
  
  async auth (params: AuthenticationParams): Promise<void> {
    const httpReponse = await this.httpPostClient.post({
      url: this.url,
      body: params
    })
    switch (httpReponse.statusCode) {
      case HttpStatusCode.unauthorized: throw new InvalidCredentialsError()
      default: return Promise.resolve()
    }
  }
}