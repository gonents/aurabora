import API from '../../../utils/APIutils'
import { Post } from '../../../utils/dataStructures/post'
import { API_PATH } from '../../../utils/definitions'

export class PostRequests {
    readonly api: API
    readonly token: string
    readonly resourcePath: string

    constructor(api: API, token: string) {
        this.api = api
        this.token = token
        this.resourcePath = `${API_PATH}/resources/Post`
    }
    
    async createNewPost(post: Post) {
        const someJsonList: Record<string, any> = {}
        post.someJsons.forEach((item, index) => {
            someJsonList[`someJson.${index}.Number`] = item.someJsonNumber
            someJsonList[`someJson.${index}.String`] = item.someJsonString
            someJsonList[`someJson.${index}.Boolean`] = item.someJsonBoolean
            someJsonList[`someJson.${index}.Date`] = item.someJsonDate.toISOString()
        })
        const newPost = await this.api.postReq(
            `${this.resourcePath}/actions/new`,
            this.token,    
            {
                'title': post.title,
                'content': post.content,
                someJsonList,
                'status': post.status,
                'published': post.published,
                'publisher': post.publisher.id

            })
        return newPost
    }

    async changePostStatus(post: Post) {
        const editPostStatus = await this.api.postReq(
            `${this.resourcePath}/records/${post.id}/edit`,
            this.token,    
            {
                'status': post.status
            }
        )
        return editPostStatus
    }

    async getFilteredListByPost(post: Post) {
        const postList = await this.api.getReq(
            `${this.resourcePath}/actions/list`,
            this.token,
            {
                'filters.id': `${post.id}`,
                'page': '1'
            }
        )
        return postList
    }
}