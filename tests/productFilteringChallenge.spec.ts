//import { FilterPage } from "../page-objects/filteringPage";
import {test, expect} from '@playwright/test'
import { PageManager } from "../page-objects/PageManager";
import { error } from 'console';

test.beforeEach(async ({page})=> {
    page.goto('https://www.cnarios.com/challenges')
    const pm = new PageManager(page)
    pm.challengesPages().gotoProductFilteringChallenge()
    expect(await page.locator('.MuiTypography-h4').textContent()).toBe('E-commerce Product Filtering & Search')
})

test("PF_001 - Filter Products by Category", async({page})=>{
    const pm =  new PageManager(page)
    
    const category = 'Electronics'
    await pm.filteringSearchPage().filterByCategory(category)

    const cardContent = await page.locator('.rounded-lg').locator('.MuiTypography-body2').allTextContents()
    //console.log(cardContent)
    cardContent.forEach(element => {
        expect.soft(element).toContain(category)    
     });   

})

test('PF_002 - Filter Products By Price Range', async({page})=>{
    try {
        const pm = new PageManager(page)

        const sliderBox = page.locator('.MuiSlider-root')
        const sliderCoordinates = await sliderBox.boundingBox()

        if (!sliderCoordinates) {
            throw error("Slider NOT AVAILABLE")
        }


        let targetXBottom = sliderCoordinates.x + (sliderCoordinates.width * .065)
        let targetXTop = sliderCoordinates.x + (sliderCoordinates.width * .625)

        const sliderBottom = page.locator('span[data-index="0"]')
        const sliderTop = page.locator('span[data-index="1"]')

        console.log(await sliderBottom.getAttribute('class'))
        await sliderBottom.hover()
        await page.mouse.down()
        await page.mouse.move(targetXBottom, 0)
        await page.mouse.up()


        console.log(await sliderTop.getAttribute('class'))
        await sliderTop.hover()
        await page.mouse.down()
        await page.mouse.move(targetXTop, 0)
        await page.mouse.up()


        expect(await page.locator('.space-y-3.overflow-y-auto.MuiBox-root').locator('.MuiTypography-root.MuiTypography-body1').textContent()).toBe('No products found')

        await page.waitForTimeout(500)



        await sliderBottom.hover()
        await page.mouse.down()
        await page.mouse.move(0, 0)
        await page.mouse.up()

        const lowerLimit = Number(await page.locator('span[data-index="0"]').locator('.MuiSlider-valueLabelLabel').textContent())
        const upperLimit = Number(await page.locator('span[data-index="1"]').locator('.MuiSlider-valueLabelLabel').textContent())
        console.log('Limite inferior: ', lowerLimit, '- Upper Limit: ', upperLimit)


        const priceString = await pm.filteringSearchPage().getProductPrice()
        priceString.forEach(element => {
            const result = element.split('•')
            const priceNumber = Number(result[1].replace('₹', '').trim())

            expect(priceNumber).toBeGreaterThanOrEqual(lowerLimit)
            expect(priceNumber).toBeLessThanOrEqual(upperLimit)

            // console.log(result)
        })

    } catch (error) {
        console.error('Test failed: ', error)
        await page.screenshot({ path: 'error.png' })
        throw error

    }


})