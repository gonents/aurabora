import API from '../../../utils/APIutils'
import { Publisher } from '../../../utils/dataStructures/publisher'
import { API_PATH } from '../../../utils/definitions'

export class PublisherRequests {
    readonly api: API
    readonly token: string
    readonly resourcePath: string

    constructor(api: API, token: string) {
        this.api = api
        this.token = token
        this.resourcePath = `${API_PATH}/resources/Publisher`
    }
    
    async createNewPublisher(publisher: Publisher) {
        const newPublisher = await this.api.postReq(
            `${this.resourcePath}/actions/new`,
            this.token,
            {
                "name": publisher.name,
                "email": publisher.email
            })
        return newPublisher
    }
}