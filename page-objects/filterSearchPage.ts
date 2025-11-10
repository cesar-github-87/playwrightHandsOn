import {Page} from '@playwright/test'
import { helperBase } from './helperBase'

export class FilterSearchPage extends helperBase{
    
    constructor(page: Page){
        super(page);
    }


    async filterByCategory(category: string){
        const dropDown = this.page.locator('.MuiSelect-root')
        await dropDown.click()
        await this.page.locator('.MuiMenuItem-root').filter({hasText:category}).click()      
        

    }

    async getListedProducts(){
        const cardContent = await this.page.locator('.rounded-lg').allTextContents()
        console.log(cardContent)
        return cardContent
        
    }

    async getProductPrice(){
        const product = this.page.locator('.rounded-lg')
        const price = await product.locator('.MuiTypography-root.MuiTypography-body2').allTextContents()
        return price
        //console.log(price)
        

       
    }


}