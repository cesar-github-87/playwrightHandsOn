import {Page} from '@playwright/test'
import { helperBase } from './helperBase'

export class LoginPage extends helperBase{
    constructor(page: Page){
        super(page);
    }

    async getPageTitle(){
        const pageTitle = await this.page.locator('.MuiTypography-h4').textContent();
        return pageTitle;
    }

    async loginFormFill(username: string, password: string){
        const loginFormUsername = this.page.locator('.MuiTextField-root').locator('label', {hasText:'Username'})
        const loginFormPassword = this.page.locator('.MuiTextField-root').locator('label', {hasText: 'Password'})
        await loginFormUsername.fill(username);
        await loginFormPassword.fill(password);
        await this.page.waitForTimeout(1500);
        /*const loginButton = this.page.getByRole("button", {name:'Login'})
        await loginButton.click()*/
    }

    async loginFormClick(){
        const loginButton = this.page.getByRole("button", {name:'Login'})
        await loginButton.click()
    }
/*
    async loginWithUserRole(username: string, password: string){
        const loginFormUsername = this.page.locator('.MuiTextField-root').locator('label', {hasText:'Username'})
        const loginFormPassword = this.page.locator('.MuiTextField-root').locator('label', {hasText: 'Password'})
        await loginFormUsername.fill(username);
        await loginFormPassword.fill(password);
        await this.page.waitForTimeout(1500);
        const loginButton = this.page.getByRole("button", {name:'Login'})
        await loginButton.click()
    }*/
}