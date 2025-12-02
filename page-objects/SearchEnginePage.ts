import {Page} from '@playwright/test';
import { helperBase } from './helperBase';

export class SearchEngine extends helperBase{

    constructor (page: Page){
       super(page);
    }

    async fillSearchBox(inputText: string){
        //console.log("Placeholder: ", await this.page.getByRole("textbox", {name:'Search...'}).getAttribute("placeholder"))
        await this.page.getByRole("textbox", {name:'Search...'}).fill(inputText)
    }

    async clickSearchButton(){
        await this.page.getByRole("button", {name:'Search'}).click()
    }

    async getResults(){
        return this.page.locator(".MuiCard-root")
    }
}