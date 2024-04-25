import { fixtures as test } from '../../fixtures/api-fixture'
import { PublisherRequests } from '../../api-client/resources/publisher/publisher'
import { Publisher } from '../../utils/dataStructures/publisher'
import { Profile } from '../../utils/dataStructures/profile'
import { expect } from '@playwright/test'
import { getToken } from '../../api-client/common/credentials'
import { ProfileRequests } from '../../api-client/resources/profile/profile'
import { Post } from '../../utils/dataStructures/post'
import { Status } from '../../utils/dataStructures/status'
import { PostRequests } from '../../api-client/resources/post/post'
import { ADMIN_EMAIL, ADMIN_PASSWORD, DATA_PREFIX } from '../../utils/definitions'

let token

test.describe('API Tests', () => {
    test('Delete Profile From Publisher', async ({ API }) => {
        // Set Prefixes
        const uniqueId = Math.floor((Math.random() * 100000) + 1)
        const entityPrefix = `${DATA_PREFIX}-${uniqueId}-`
        
        // Test data
        let publisher1: Publisher = { name: `${entityPrefix}Publisher1`, email: `${entityPrefix}@publisher1.com`}
        let publisher2: Publisher = { name: `${entityPrefix}Publisher2`, email: `${entityPrefix}@publisher2.com`}
        let profile1: Profile = { bio: `${entityPrefix}profile1`, publisher: publisher1}
        let profile2: Profile = { bio: `${entityPrefix}profile2`, publisher: publisher2}

        // 0. Get Token and initiate resources
        const token = await getToken(API, ADMIN_EMAIL, ADMIN_PASSWORD)
        const publisherRequests = new PublisherRequests(API, token)
        const profileRequests = new ProfileRequests(API, token)
        
        // 1. Create publishers
        const createPublisher1 = await publisherRequests.createNewPublisher(publisher1)
        expect.soft(createPublisher1.status()).toBe(200)
        const createPublisher1Json = JSON.parse(await createPublisher1.text())
        expect.soft(typeof createPublisher1Json.record.id).toBe('number')
        publisher1.id = createPublisher1Json.record.id

        const createPublisher2 = await publisherRequests.createNewPublisher(publisher2)
        expect.soft(createPublisher2.status()).toBe(200)
        const createPublisher2Json = JSON.parse(await createPublisher2.text())
        expect.soft(typeof createPublisher2Json.record.id).toBe('number')
        publisher2.id = createPublisher2Json.record.id

        // 2. Create profiles
        const createProfile1 = await profileRequests.createNewProfile(profile1)
        expect.soft(createProfile1.status()).toBe(200)
        const createProfile1Json = JSON.parse(await createProfile1.text())
        expect.soft(typeof createProfile1Json.record.id).toBe('number')
        profile1.id = createProfile1Json.record.id

        const createProfile2 = await profileRequests.createNewProfile(profile2)
        expect.soft(createProfile2.status()).toBe(200)
        const createProfile2Json = JSON.parse(await createProfile2.text())
        expect.soft(typeof createProfile2Json.record.id).toBe('number')
        profile2.id = createProfile2Json.record.id

        // 3. Delete Profile 2
        await profileRequests.deleteProfile(profile2)

        // 4. Validate profile in no longer in profile list
        const profile2FilteredList = await profileRequests.getFilteredListByProfile(profile2)
        expect.soft(profile2FilteredList.status()).toBe(200)
        const profile2FilteredListJson = JSON.parse(await profile2FilteredList.text())
        expect(profile2FilteredListJson.meta.total).toBe(0)
    }),

    test('Change Post status to "REMOVED"', async ({ API }) => {
        // Set Prefixes
        const uniqueId = Math.floor((Math.random() * 100000) + 1)
        const entityPrefix = `${DATA_PREFIX}-${uniqueId}-`
        
        // Test data
        let publisher1: Publisher = { name: `${entityPrefix}Publisher1`, email: `${entityPrefix}@publisher1.com`}
        let post1: Post = {
            title: `${entityPrefix}Title1`,
            content: 'context1',
            someJsons: [{ someJsonNumber: 1, someJsonString: 'a', someJsonBoolean: true, someJsonDate: new Date()}],
            status: Status.Active,
            published: true,
            publisher: publisher1
        }
        // 0. Get Token and initiate resources
        const token = await getToken(API, ADMIN_EMAIL, ADMIN_PASSWORD)
        const publisherRequests = new PublisherRequests(API, token)
        const postRequests = new PostRequests(API, token)
        
        // 1. Create publisher
        const createPublisher1 = await publisherRequests.createNewPublisher(publisher1)
        expect.soft(createPublisher1.status()).toBe(200)
        const createPublisher1Json = JSON.parse(await createPublisher1.text())
        expect.soft(typeof createPublisher1Json.record.id).toBe('number')
        publisher1.id = createPublisher1Json.record.id

        // 2. Create post
        const createPost1 = await postRequests.createNewPost(post1)
        expect.soft(createPost1.status()).toBe(200)
        const createPost1Json = JSON.parse(await createPost1.text())
        expect.soft(typeof createPost1Json.record.id).toBe('number')
        post1.id = createPost1Json.record.id

        // 3. Change post status to `REMOVED`
        post1.status = Status.Removed
        const changePost1 = await postRequests.changePostStatus(post1)
        expect.soft(changePost1.status()).toBe(200)
        const changePost1Json = JSON.parse(await changePost1.text())
        expect.soft(changePost1Json.record.params.status).toBe(Status.Removed.toString())

        // 4. Validate post status has changed in Posts list
        const post1FilteredList = await postRequests.getFilteredListByPost(post1)
        expect.soft(post1FilteredList.status()).toBe(200)
        const post1FilteredListJson = JSON.parse(await post1FilteredList.text())
        expect(post1FilteredListJson.records[0].params.id).toBe(post1.id)
        expect(post1FilteredListJson.records[0].params.status).toBe(post1.status.toString())
    })
})