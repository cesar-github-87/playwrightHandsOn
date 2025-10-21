//Es un archivo que sirve en caso de que tengamos funciones que se necesiten a través de diferentes Page Objects:
import {Page} from '@playwright/test'

export class helperBase{
    readonly page: Page

    constructor(page:Page){
        this.page = page
    }

    async waitForNumberOfSeconds(timeInSeconds: number){
        await this.page.waitForTimeout(timeInSeconds*1000)
    }
}