import API from '../../../utils/APIutils'
import { Profile } from '../../../utils/dataStructures/profile'
import { API_PATH } from '../../../utils/definitions'

export class ProfileRequests {
    readonly api: API
    readonly token: string
    readonly resourcePath: string

    constructor(api: API, token: string) {
        this.api = api
        this.token = token
        this.resourcePath = `${API_PATH}/resources/Profile`
    }
    
    async createNewProfile(profile: Profile) {
        const newProfile = await this.api.postReq(
            `${this.resourcePath}/actions/new`,
            this.token,    
            {
                "bio": profile.bio,
                "publisher": profile.publisher.id
            })
        return newProfile
    }

    async deleteProfile(profile: Profile) {
        const deleteProfile = await this.api.postReq(
            `${this.resourcePath}/records/${profile.id}/delete`,
            this.token)
        return deleteProfile
    }

    async getFilteredListByProfile(profile: Profile) {
        const profileList = await this.api.getReq(
            `${this.resourcePath}/actions/list`,
            this.token,
            {
                'direction': 'desc',
                'sortBy': 'id',
                'filters.id': `${profile.id}`,
                'page': '1'
            }
        )
        return profileList
    }
}