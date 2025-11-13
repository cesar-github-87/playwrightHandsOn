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
      //  console.log(cardContent)
        return cardContent
        
    }

    async getProductNames(){
        const productName = await this.page.locator('.rounded-lg').locator('.MuiTypography-body1').allTextContents()
        return productName
    }

    async getProductDescription(){
        const product = this.page.locator('.rounded-lg')
        const price = await product.locator('.MuiTypography-root.MuiTypography-body2').allTextContents()
        return price
        //console.log(price)
               
    }

    async getProductsNameAfterFilter() {

        let listedProductName:string[] = []
        let listedProducts = await this.getListedProducts()

        listedProducts.forEach(element => {
            const result = element.split('•')
            const productName = result[0].replace('Clothing', "").trim()
            listedProductName.push(productName)

        })

        return listedProductName

    }

    async getListedProductsSplit(){
        let productsSplit = []
        const listedProducts = await this.page.locator('.rounded-lg').all()

       for(const card of listedProducts){
            const product = {
                name: await card.locator('.MuiTypography-body1').textContent(),
                desc: await card.locator('.MuiTypography-body2').textContent()
            }
            productsSplit.push(product)
            
       }

       return productsSplit

    }


}