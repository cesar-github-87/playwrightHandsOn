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

        //console.log(await sliderBottom.getAttribute('class'))
        await sliderBottom.hover()
        await page.mouse.down()
        await page.mouse.move(targetXBottom, 0)
        await page.mouse.up()


        //console.log(await sliderTop.getAttribute('class'))
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
       // console.log('Limite inferior: ', lowerLimit, '- Upper Limit: ', upperLimit)


        const priceString = await pm.filteringSearchPage().getProductDescription()
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

test('PF_003 - Filter Products by Minimum Rating', async({page})=>{
/**
 * Description:
    Select minimum rating and verify products meet or exceed that rating

    Steps to Execute:
        Navigate to product listing page
        Set minimum rating filter to 4 stars
        Verify all displayed products have rating >= 4  
 * 
 */

    const pm = new PageManager(page)

    await page.getByText('4.5 Stars').click({force:true})//locator('input[value="5"]').click({force:true})

    const products =  await pm.filteringSearchPage().getProductDescription()
    products.forEach(element=>{
        const result =  element.split('•')
        const rating = Number(result[2].replace('⭐', '').trim())
        //console.log(rating)
        expect(rating).toBeGreaterThanOrEqual(4)
    })

  

})

test("PF_004 - Show only in-stock products", async({page})=>{
    const pm =  new PageManager(page)
    //pm.filteringSearchPage()
    /**
     * Enable 'In Stock Only' filter and verify out-of-stock items are hidden

        Steps to Execute:
        Navigate to product listing page
        Enable 'In Stock Only' filter
        Verify all displayed products are in stock
     */

    await page.getByRole('checkbox').click()
    const availability = await page.locator('.MuiTypography-caption').allTextContents()
    availability.forEach(element=>{
        expect(element).toBe('In Stock')
    })
    


})

test('PF_005 - Reset Filters', async({page})=>{
    /**
     * Apply multiple filters, reset them, and verify the full product list is shown

        Steps to Execute:
        Navigate to product listing page
        Apply category, price, and stock filters
        Click reset button
        Verify all filters are cleared
        Verify full default product list is restored

    */

    const pm = new PageManager(page)

    let filteredProductsExpected = ['Cotton T-Shirt', 'Jacket', 'Formal Shirt']    
    let defaultProductsExpected = [  'Wireless MouseElectronics',  'Bluetooth KeyboardElectronics',  'USB-C ChargerElectronics',  'Running ShoesSports',  'Tennis RacketSports',  'Water BottleSports',  'Cotton T-Shirt',  'Jeans',  'Jacket',  'SmartphoneElectronics',  'TabletElectronics',  'Gaming ConsoleElectronics',  'Yoga MatSports',  'Soccer BallSports',  'Formal Shirt']    /** -----------------------------Filtering Products ------------------------------------*/
    const categoryFitler = 'Clothing'
    await pm.filteringSearchPage().filterByCategory(categoryFitler)

    const sliderBox = page.locator('.MuiSlider-root')
    const sliderCoordinates = await sliderBox.boundingBox()

    if (!sliderCoordinates) {
        throw error("Slider NOT AVAILABLE")
    }

   
    let targetXBottom = sliderCoordinates.x + (sliderCoordinates.width * .065)
    let targetXTop = sliderCoordinates.x + (sliderCoordinates.width * .0125)

    await page.waitForTimeout(500)
    const topSlider = page.locator('span[data-index="1"]')
   

    await topSlider.hover({force:true})
    await page.mouse.down()
    await page.mouse.move(targetXTop, 0)
    await page.mouse.up()

    await page.waitForTimeout(500)
    await page.getByRole('checkbox').click()
    /**----------------------Getting products filtered--------------------------- */
    let listedProductName =  await pm.filteringSearchPage().getProductsNameAfterFilter()
   

    listedProductName =  listedProductName.sort()   
    filteredProductsExpected = filteredProductsExpected.sort()
    expect.soft(listedProductName).toEqual(filteredProductsExpected)


    /**-----------------------Resetting Filters------------------------------------- */
    await page.getByRole('button', {name: 'Reset Filters'}).click()

    /**-----------------------Getting ALL Products --------------------------------- */

    listedProductName =  await pm.filteringSearchPage().getProductsNameAfterFilter()
    listedProductName =  listedProductName.sort()
    defaultProductsExpected = defaultProductsExpected.sort()

    expect(listedProductName).toEqual(defaultProductsExpected)



    

})

test("PF_006 - Verify Product card Details format after filtering", async({page})=>{
    /**
     *  Navigate to product listing page
        Apply category filter
        Verify each product card displays name -
        Verify price is shown with currency symbol -
        Verify category label is present - 
        Verify rating stars are visible and read-only
     * 
     * 
     */

        const pm = new PageManager(page)
        const filterCat = 'Electronics'

        const list = await pm.filteringSearchPage().getListedProductsSplit()

        await pm.filteringSearchPage().filterByCategory(filterCat)

        list.forEach(element=>{
            expect.soft(element.name).not.toBe("")
            const descSplit = element.desc?.split('•')
            //console.log(descSplit)

            if(!descSplit){
                throw error('No Description')
            }
            
            const category = descSplit[0].trim()
            const price =  descSplit[1].trim()
            const stars = descSplit[2].trim()

            expect.soft(price).toContain('₹')
            expect.soft(category).not.toBe('')
            expect.soft(stars).toContain('⭐')
            
           
            
        })
       // console.log(list)
        


})