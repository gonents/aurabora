import { type Locator, type Page } from '@playwright/test'
import { Publisher } from '../utils/dataStructures/publisher'

export class PublisherPage {
    readonly page: Page
    readonly createNewButton: Locator
    readonly publisherNameInput: Locator
    readonly publisherEmailInput: Locator
    readonly saveButton: Locator

    constructor(page: Page) {
        this.page = page
        
        // Create Publisher
        this.createNewButton = page.getByTestId('action-new').first()
        this.publisherNameInput = page.getByTestId('property-edit-name').locator('input')
        this.publisherEmailInput = page.getByTestId('property-edit-email').locator('input')
        this.saveButton = page.getByTestId('button-save')
    }
    
    async navigate () {
        await this.page.goto('admin/resources/Publisher')
    }

    async createNewPublisher(publisher: Publisher) {
        await this.createNewButton.click()
        await this.publisherNameInput.fill(publisher.name)
        await this.publisherEmailInput.fill(publisher.email)
        await this.saveButton.click()
    }
}