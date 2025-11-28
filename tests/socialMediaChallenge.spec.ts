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
     */


    const notiBell = page.locator(".MuiIconButton-root").locator(".MuiBadge-root")
    //

    const posts = await pm.socialMediaPages().getPostsInfo() 
    
     //Like one post, check heart is filled using its css, and notif counter is 1   
    await posts[1].likeButton.click()
    let heartColor = await posts[1].likeButton.locator('svg').evaluate((element)=>{
        return window.getComputedStyle(element).getPropertyValue('color')
    })

    console.log(heartColor)
    expect.soft(heartColor, `${heartColor} value is not correct`).toContain("211, 47, 47")
    expect.soft(await notiBell.locator(".MuiBadge-badge").textContent()).toBe('1')    
    
    //Dislike one post, check heart is NOT filled using its css, and notif counter is 2
    await posts[1].likeButton.click()
   
    heartColor = await posts[1].likeButton.locator('svg').evaluate((element)=>{
        return window.getComputedStyle(element).getPropertyValue('color')
    })
    console.log(heartColor)
    expect.soft(heartColor, `${heartColor} value is not correct`).toContain("0, 0, 0")
    expect.soft(await notiBell.locator(".MuiBadge-badge").textContent()).toBe('2')   

    
    //VERIFY NOTIFICATION BACKGROUND COLOR
    const bellDot = notiBell.locator('.MuiBadge-badge')
    let notifBGColor = await bellDot.evaluate((element)=>{
        return window.getComputedStyle(element).getPropertyValue('background-color')
    })
    expect.soft(notifBGColor, `${notifBGColor} value is not correct`).toContain("211, 47, 47")


})


test("SMF004_Mark Notifications as Seen", async({page})=>{
    /*
    Click like on a post to generate notification
    Verify badge shows count
    Open notifications modal
    Verify notification dot is removed and text is gray
    Close modal and confirm badge count is 0
    */
    const pm = new PageManager(page)
    const posts = await pm.socialMediaPages().getPostsInfo()

    await posts[1].likeButton.click()

    const notiBell = page.locator(".MuiIconButton-root").locator(".MuiBadge-root")

    expect(await notiBell.locator(".MuiBadge-badge").textContent()).toBe("1")

    await notiBell.click()

    expect(await notiBell.locator(".MuiBadge-badge").getAttribute("class")).toContain("MuiBadge-invisible")

    const texts = (await pm.socialMediaPages().getNotificationTexts()).locator('.MuiTypography-body2')
   
    let textColor =  await texts.evaluate((element)=>{
        return window.getComputedStyle(element).getPropertyValue('color')
    })

    console.log(textColor)

    expect(textColor).toContain("0.707 0.022 261.325")

    await page.keyboard.press('Escape')
    

    expect(await notiBell.locator(".MuiBadge-badge").textContent()).toBe('0')


})

test("SMF005_Like Multiple Posts Independently", async ({page})=>{
    /**Like the first post
        Like the second post
        Verify both posts show incremented counts and filled hearts
        Verify other posts remain unaffected */

    const pm = new PageManager(page)
    const posts = await pm.socialMediaPages().getPostsInfo()
    
    let likesText = await posts[0].likesText.textContent()    
    let number = likesText?.replace("likes", "").trim()

    await posts[0].likeButton.click()
    await posts[1].likeButton.click()





        
})