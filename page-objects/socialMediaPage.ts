import {Page} from '@playwright/test'
import { helperBase } from './helperBase'


export class SocialMedia extends helperBase{

    constructor(page: Page){
        super(page);
    }

    async getPostsInfo(){
      

        const postObjs=[]
        const posts =  await this.page.locator('.flex').locator('.MuiPaper-root.MuiPaper-rounded').all()

        for(const cards of posts){

            const entries = {
                user: cards.locator('h6'),
                likesText: cards.locator('.MuiTypography-body1'),
                likeButton: cards.getByRole('button')
            }
           
            postObjs.push(entries)
            
        }
        
       return postObjs

    }


    async getNotificationTexts(){
       return this.page.locator(".shadow-lg")
    }

}