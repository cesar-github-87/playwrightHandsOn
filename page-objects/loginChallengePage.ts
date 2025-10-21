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
}