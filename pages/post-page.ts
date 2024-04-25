import { type Locator, type Page } from '@playwright/test'
import { Post } from '../utils/dataStructures/post'
import { Status } from '../utils/dataStructures/status'
import { SomeJson } from '../utils/dataStructures/some-json'

export class PostPage {
    readonly page: Page
    readonly createNewButton: Locator
    readonly titleInput: Locator
    readonly contentInput: Locator
    readonly addnewSomeJsonItem: Locator
    readonly statusInput: Locator
    readonly publishedInput: Locator
    readonly publisherInput: Locator
    readonly saveButton: Locator
    readonly filterButton: Locator
    readonly filerByTitleInput: Locator
    readonly buttonApplyChanges: Locator
    readonly postActionEdit: Locator
    readonly postActionDelete: Locator
    readonly postEditPageIndicator: Locator
    readonly postListDisplayIndicator: Locator
    readonly postTitleInList: Locator
    readonly confirmButton: Locator
    readonly showPostStatus: Locator

    constructor(page: Page) {
        this.page = page
        
        // Create Post
        this.createNewButton = page.getByTestId('action-new').first()
        this.titleInput = page.getByTestId('property-edit-title').locator('input')
        this.contentInput = page.getByTestId('property-edit-content').locator('input')
        this.addnewSomeJsonItem = page.getByTestId('someJson-add')
        this.statusInput = page.getByTestId('property-edit-status').locator('[class*="container"]').first()
        this.publishedInput = page.getByTestId('property-edit-published').locator('a')
        this.publisherInput = page.getByTestId('property-edit-publisher') 
        this.saveButton = page.getByTestId('button-save')
        
        // Filter Posts
        this.filterButton = page.locator('[data-css="Post-filter-button"]')
        this.filerByTitleInput = page.locator('[name="filter-title"]')
        this.buttonApplyChanges = page.getByRole('button', { name: 'Apply changes' })

        // Post List
        this.postTitleInList = page.getByTestId('property-list-title')
        this.postListDisplayIndicator = page.locator('[data-css="Post-list-table-wrapper"]')

        // Post Show View
        this.postActionEdit = page.getByTestId('action-edit')
        this.postActionDelete = page.getByTestId('action-delete')
        this.confirmButton = page.getByRole('button', { name: 'Confirm'})
        this.postEditPageIndicator = page.locator('[data-css="Post-edit-action-header"]')
        this.showPostStatus = page.getByTestId('property-list-status')
    }
    
    async navigate () {
        await this.page.goto('/admin/resources/Post')
    }

    async createNewPost(post: Post) {
        await this.createNewButton.click()
        await this.titleInput.fill(post.title)
        await this.contentInput.fill(post.content)
        await this.fillSomeJsons(post.someJsons)
        await this.statusInput.click()
        await this.statusInput.getByText(post.status, { exact: true }).click()
        if (post.published == true) {
            await this.publishedInput.click()
        }
        await this.publisherInput.locator('input').fill(post.publisher.email)
        await this.publisherInput.getByText(post.publisher.email, { exact: true }).click()
        await this.saveButton.click()
    }

    async fillSomeJsons(someJsons:[SomeJson]) {
        for (const someJson of someJsons) {
            await this.addnewSomeJsonItem.click()
            let someJsonIndex = someJsons.indexOf(someJson)
            await this.page.getByTestId(`property-edit-someJson.${someJsonIndex}.number`).locator('input').fill(someJson.someJsonNumber.toString())
            await this.page.getByTestId(`property-edit-someJson.${someJsonIndex}.string`).locator('input').fill(someJson.someJsonString)
            if (someJson.someJsonBoolean == true) {
                await this.page.getByTestId(`property-edit-someJson.${someJsonIndex}.boolean`).locator('a').click()
            }
            await this.page.getByTestId(`property-edit-someJson.${someJsonIndex}.date`).locator('[class*="input-container"]').locator('input').fill(convertDateToString(someJson.someJsonDate))
        }
    }

    async enterIntoPost(post: Post) {
        await this.filterResultsByTitle(post)
        await this.postTitleInList.getByText(post.title, { exact: true}).click()
    }

    async filterResultsByTitle(post:Post) {
        await this.filterButton.click()
        await this.filerByTitleInput.fill(post.title)
        await this.buttonApplyChanges.click()
    }

    async changePostStatus(status:Status) {
        if (await this.postEditPageIndicator.isVisible() == false) {
            await this.postActionEdit.click()
        }
        await this.statusInput.click()
        await this.statusInput.getByText(status, { exact: true }).click()
        await this.saveButton.click()
    }

    async getPostStatus(post:Post) {
        await this.filterResultsByTitle(post)
        return this.showPostStatus.innerText()
    }
}

function convertDateToString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}${month}${day} ${hours}${minutes}`      
}