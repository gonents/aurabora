import { type Locator, type Page } from '@playwright/test'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../utils/definitions'

const defaultEmail = ADMIN_EMAIL
const defaultPassword = ADMIN_PASSWORD

export class Login {
    readonly page: Page
    readonly email: Locator
    readonly password: Locator
    readonly LoginButton: Locator

    constructor(page: Page) {
        this.page = page
        this.email = page.getByPlaceholder('Email')
        this.password = page.getByPlaceholder('password')
        this.LoginButton = page.getByRole( 'button', { name: 'Login'})
    }
    
    async navigate () {
        await this.page.goto('/admin/login')
    }

    async doLogin(username: string = defaultEmail, password: string = defaultPassword) {
        await this.email.fill(username)
        await this.password.fill(password)
        await this.LoginButton.click()
    }
}