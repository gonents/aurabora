import { expect, test } from '@playwright/test'
import { Publisher } from '../../utils/dataStructures/publisher'
import { Profile } from '../../utils/dataStructures/profile'
import { Login } from '../../pages/login'
import { PublisherPage } from '../../pages/publisher-page'
import { ProfilePage } from '../../pages/profile-page'
import { Post } from '../../utils/dataStructures/post'
import { Status } from '../../utils/dataStructures/status'
import { PostPage } from '../../pages/post-page'
import { DATA_PREFIX } from '../../utils/definitions'

test.describe('UI Tests', () => {  
    test('Delete Profile From Publisher', async ({ page }) => {
        const uniqueId = Math.floor((Math.random() * 100000) + 1)
        const entityPrefix = `${DATA_PREFIX}-${uniqueId}-`
        // Test data
        let publisher1: Publisher = { name: `${entityPrefix}Publisher1`, email: `${entityPrefix}@publisher1.com`}
        let publisher2: Publisher = { name: `${entityPrefix}Publisher2`, email: `${entityPrefix}@publisher2.com`}
        let profile1: Profile = { bio: `${entityPrefix}profile1`, publisher: publisher1}
        let profile2: Profile = { bio: `${entityPrefix}profile2`, publisher: publisher2}


        // 1. Do login
        const loginPage = new Login(page)
        await loginPage.navigate()
        await loginPage.doLogin()
        
        // 2. Create two Publishers and two Profiles
        const publisherPage = new PublisherPage(page)
        await publisherPage.navigate()
        await publisherPage.createNewPublisher(publisher1)
        await publisherPage.createNewPublisher(publisher2)
        const profilePage = new ProfilePage(page)
        await profilePage.navigate()
        await profilePage.createNewProfile(profile1)
        await profilePage.createNewProfile(profile2)

        // 3. Delete first Profile
        await profilePage.deleteProfile(profile1)

        // 4. Verify first Profile is been deleted
        await profilePage.filterResultsByBio(profile1)
        expect(await profilePage.isNoResultsDisplayed()).toBeTruthy()
        await profilePage.filterResultsByBio(profile2)
        expect(await profilePage.isNoResultsDisplayed()).toBeFalsy()
    }),
    
    test('Change Post status to "REMOVED"', async ({ page }) => {
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
        
        // 1. Do login
        const loginPage = new Login(page)
        await loginPage.navigate()
        await loginPage.doLogin()
        
        // 2. Create Publisher and Post
        const publisherPage = new PublisherPage(page)
        await publisherPage.navigate()
        await publisherPage.createNewPublisher(publisher1)
        const postPage = new PostPage(page)
        await postPage.navigate()
        await postPage.createNewPost(post1)

        // 3. Change post status to 'REMOVED'
        await postPage.navigate()
        await postPage.enterIntoPost(post1)
        await postPage.changePostStatus(Status.Removed)
        
        // 4. Validate post status was changed to 'REMOVED'
        expect(await postPage.getPostStatus(post1)).toBe(Status.Removed.toString())
    })
})
