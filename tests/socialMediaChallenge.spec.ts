import { PageManager } from "../page-objects/PageManager";
import {test, expect} from '@playwright/test'


test.beforeEach(async({page})=>{
    await page.goto('https://www.cnarios.com/challenges')
    const pm = new PageManager(page)
 
    await pm.challengesPages().goToSocialChallenge()
    await page.waitForTimeout(500)

    //const pm = new PageManager(page)
    


})

test('SMF_001 - Like a post and verify count + icon', async({page})=>{
    /**
     *  Click the like button on a post and confirm the like count increases and icon is filled
        Steps to Execute:
        Locate a post by user name
        Click the like button (outlined heart)
        Verify like count increases by 1
        Verify heart icon changes to filled state    
     * 
     */

    const pm = new PageManager(page)
 
   
    const entries = await pm.socialMediaPages().getPostsInfo()

    for (const cards of entries){

        
        const user = await cards.user.textContent()
        let likesCounter = await cards.likesText.textContent()
        const previousLike =  Number(likesCounter?.replace("likes", '').trim())
        
        if(user=='Liam'){
            console.log("im in")
            await page.waitForTimeout(500)
            await cards.likeButton.click({force:true})

            console.log('Before Like - ',Number(previousLike))            
            likesCounter = await cards.likesText.textContent()
            console.log( 'After Like - ',   Number(likesCounter?.replace('likes', "").trim()))
            expect(Number(likesCounter?.replace('likes', "").trim())).toBe(previousLike+1)

            const filledHeart = await cards.likeButton.locator('svg').getAttribute('class')
            console.log("Atributos ", filledHeart)

            //USAR VALIDACION DE IMGAGEN JUNTO CON LA DE CLASS!
        }
       
       
    }


    
})