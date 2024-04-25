import { type Locator, type Page } from '@playwright/test'
import { Profile } from '../utils/dataStructures/profile'

export class ProfilePage {
    readonly page: Page
    readonly createNewButton: Locator
    readonly profileBioInput: Locator
    readonly profilePublisherInput: Locator
    readonly saveButton: Locator
    readonly filterButton: Locator
    readonly filerByBioInput: Locator
    readonly buttonApplyChanges: Locator
    readonly profileBioInList: Locator
    readonly profileActionDelete: Locator
    readonly confirmButton: Locator
    readonly profileListDisplayIndicator: Locator
    readonly noRecordsIndicator: Locator

    constructor(page: Page) {
        this.page = page
        
        // Create Profile
        this.createNewButton = page.getByTestId('action-new').first()
        this.profileBioInput = page.getByTestId('property-edit-bio').locator('input')
        this.profilePublisherInput = page.getByTestId('property-edit-publisher')
        this.saveButton = page.getByTestId('button-save')
        
        // Filter Profile
        this.filterButton = page.locator('[data-css="Profile-filter-button"]')
        this.filerByBioInput = page.locator('[name="filter-bio"]')
        this.buttonApplyChanges = page.getByRole('button', { name: 'Apply changes' })

        // Profiles List
        this.profileBioInList = page.getByTestId('property-list-bio')
        this.profileListDisplayIndicator = page.locator('[data-css="Profile-list-table-wrapper"]')
        this.noRecordsIndicator = page.getByRole('heading', { name: 'No records'})

        // Profile Show View
        this.profileActionDelete = page.getByTestId('action-delete')
        this.confirmButton = page.getByRole('button', { name: 'Confirm'})
    }
    
    async navigate () {
        await this.page.goto('/admin/resources/Profile')
    }

    async createNewProfile(profile: Profile) {
        await this.createNewButton.click()
        await this.profileBioInput.fill(profile.bio)
        await this.profilePublisherInput.locator('input').fill(profile.publisher.email)
        await this.profilePublisherInput.getByText(profile.publisher.email, { exact: true }).click()
        await this.saveButton.click()
    }

    async enterIntoProile(profile: Profile) {
        await this.filterResultsByBio(profile)
        await this.profileBioInList.getByText(profile.bio, { exact: true}).click()
    }

    async filterResultsByBio(profile:Profile) {
        await this.filterButton.click()
        await this.filerByBioInput.fill(profile.bio)
        await this.buttonApplyChanges.click()
    }

    async deleteProfile(profile: Profile) {
        await this.filterResultsByBio(profile)
        await this.enterIntoProile(profile)
        await this.profileActionDelete.click()
        await this.confirmButton.click()
    }

    async isNoResultsDisplayed() {
        this.profileListDisplayIndicator.waitFor()
        return this.noRecordsIndicator.isVisible()
    }
}