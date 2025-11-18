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

            //FALTA VERIFICAR LA CLASE
            await expect(cards.likeButton).toHaveScreenshot()


            //USAR VALIDACION DE IMGAGEN JUNTO CON LA DE CLASS!
        }
      
       
    }    
})

test("SMF_002 -Unlike a previously liked post ", async({page})=>{
/**
 * Click the like button again to unlike a post and confirm count decreases

    Steps to Execute:
    Locate a post that is already liked
    Click the filled heart icon
    Verify like count decreases by 1
    Verify heart icon returns to outlined state*/ 

    const pm = new PageManager(page)
    let entries = await pm.socialMediaPages().getPostsInfo()

    /*Click Like on all entries*/
  
    

    for(const post of entries){
        await post.likeButton.click()        

    }

    
    let likedEntry =  page.locator('.flex').locator('.MuiPaper-root.MuiPaper-rounded').getByRole("button").nth(0)
  
    /**  *Find the first post that has a heart filled    */
    expect(await likedEntry.locator('svg').getAttribute("class")).toContain("MuiSvgIcon-colorError")

    let likesText = await page.locator('.flex').locator('.MuiPaper-root.MuiPaper-rounded').locator('.MuiTypography-body1').nth(0).textContent()
    let likesNumber = Number(likesText?.replace("likes", '').trim())
    console.log(likesNumber)

    await likedEntry.click()
    likesText = await page.locator('.flex').locator('.MuiPaper-root.MuiPaper-rounded').locator('.MuiTypography-body1').nth(0).textContent()
    let dislikedNumber = Number(likesText?.replace("likes", '').trim())

    expect(dislikedNumber).toBe(likesNumber-1)
    await expect(likedEntry).toHaveScreenshot()



})




test("SMF_003 - Generate notification when liking a post", async({page})=>{
    const pm = new PageManager(page)

    /**
     *  Test Steps & Details
        Description:
        Check that a new notification is created after liking a post

        Steps to Execute:
        Click like on a post
        Check notification badge shows count increment
        Open notifications modal
        Verify new notification text is displayed with a dot

        -----------------------------------------------------
        verificar que de inicio no exista el punto rojo en la campana
        dar like a un post
        verificar que aparezca un punto rojo con un numero 1 en el 
        dar like al mismo post
     *  verificar que aparezca un punto rojo con un numero 1 en el 
        
     */


    const notiBell = page.getByRole






})