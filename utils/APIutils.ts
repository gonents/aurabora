import { APIRequestContext } from "playwright-core"

export default class API {
  readonly request: APIRequestContext

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  private async makeRequest(endpoint: string, method:string, reqBody?: object, token?: string, queryParams?: object) {
    const res = await this.request[method](endpoint, {
        Headers: {
            'Accept': 'application/json, text/plain, */* ',
            'Cookie': `${token}`
        },
        data: reqBody,
        params: queryParams
    })
    return res
  }

  async getReq(endpoint: string, token?: string, queryParams?: object) {
    return this.makeRequest(endpoint, 'get', undefined, token, queryParams)
  }

  async postReq(endpoint: string, token: string, reqBody?: object) {
    return this.makeRequest(endpoint, 'post', reqBody, token)
  }

  async putReq(endpoint: string, reqBody: object, token: string) {
    return this.makeRequest(endpoint, 'put', reqBody, token)
  }

  async patchReq(endpoint: string, reqBody: object, token:string) {
    return this.makeRequest(endpoint, 'patch', reqBody, token)
  }

  async deleteReq(endpoint: string, token:string) {
    return this.makeRequest(endpoint, 'delete', undefined, token)
  }

  async getStorageState(){
    return await this.request.storageState()
  }
}