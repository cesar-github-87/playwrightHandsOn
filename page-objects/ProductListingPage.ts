import { Page, Locator} from '@playwright/test';
import { helperBase } from './helperBase';  


export class ProductListingPage extends helperBase{

    constructor(page: Page){
        super(page);
    }

    async getPageTitle(){
        const pageTitle = this.page.locator('.MuiTypography-h4').textContent();
        //console.log(await pageTitle.textContent());
        return pageTitle;
    }



}