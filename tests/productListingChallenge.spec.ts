import {test, expect} from '@playwright/test';
import { PageManager } from '../page-objects/PageManager';

test.beforeEach(async({page})=>{
    await page.goto("https://www.cnarios.com/challenges");
    //await page.waitForLoadState("domcontentloaded" )
})


test ("PLP_001 - Count Products in each category", async({page})=>{

    const categoryInfo={
            'Clothing': 9,
            'Books': 6,
            'Sports':8,
            'Home':7,
            'Electronics':10

        }
    
    /*
    console.log("MI OBJECTO DE REFERENCIA: ", baseInfo)
    */
    Object.keys(categoryInfo).forEach(key => {
       // console.log(categoryInfo[key as keyof typeof categoryInfo]);
    });


    const pm = new PageManager(page);
    await page.waitForTimeout(1500);    
    await pm.challengesPages().goToProductListingChallenge();
    await page.waitForTimeout(1500);
    expect (await pm.productListingChallengePage().getPageTitle()).toBe('E-commerce Product Listing & Pagination');


    const countedCategories = await pm.productListingChallengePage().countCategories()
   // console.log('Objeto referencia: ', categoryInfo)
    //console.log("Objeto leido desde pagina con mis conteos: ", countedCategories)


    //SIN ADENTRARME EN MOSTRAR LAS DIFERENCIAS, COMPARO SI SOLAMENTE TIENEN LOS MISMOS VALORES Y REGRESO TRUE O FALSE
    const cat1 = Object.keys(categoryInfo)
    const cat2 = Object.keys(countedCategories)
    
    let equalObjects = true
    for(const c of cat1){
        const expectedValue = categoryInfo[c as keyof typeof categoryInfo]
        const actualValue = countedCategories[c]
        if(expectedValue!== actualValue){
            
            equalObjects=false;
            //break;
        }
        
    }
     //equalObjects=true;

    expect(equalObjects).toBeTruthy()

})


test('PLP_002- Finds specific product and identify its page', async({page})=>{
    const nextButton = page.getByRole("button", {name:'Next', exact:true})
    const targetProduct = "Dyson V15 Detect Vacuum"
    const pm =  new PageManager(page)
    await pm.challengesPages().goToProductListingChallenge()
    await page.waitForTimeout(1500)    
    

    let listedProducts = await pm.productListingChallengePage().retrieveProducts()
    let pageProducts = await listedProducts.locator('h6.font-semibold').allTextContents()

    let found = false
    let pageNumber
   // console.log(pageProducts.length)

    while(!found){
        for(let i=0; i< pageProducts.length;i++){
            
            if(targetProduct === pageProducts[i]){            
                found = true
                pageNumber = await pm.productListingChallengePage().getCurrentPage()
                //console.log(`I've found "${targetProduct}" on page "${pageNumber}" in position "${i+1}"` )
                break
            }
        
              
        }
        if(!found){
            let buttonClass = await nextButton.getAttribute('class'); //reviso el atributo CLASS
            if(buttonClass?.includes('Mui-disabled') ){
                throw new Error('Test failed: Product not found');
                break;
            }
            await pm.productListingChallengePage().clickNextButton()
            await page.waitForTimeout(1500)  
            listedProducts = await pm.productListingChallengePage().retrieveProducts()
            pageProducts = await listedProducts.locator('h6.font-semibold').allTextContents()
            
        }
        
       
    }

    expect(found).toBeTruthy

    

})

test('PLP_003 - Find the Highest-rated product in each category', async({page})=>{
    const baseRate={
         
            'Books': {'name': 'The Pragmatic Programmer', 'price': '$29.99', 'rating': 5 },
            'Sports': { 'name': 'Wilson Pro Staff Tennis Racket','price': '$249.99','rating': 5},
            'Home': { 'name': 'Samsung Smart Refrigerator', 'price': '$1799.99', 'rating': 5 },
            'Clothing': { 'name': 'Nike Air Force 1 Sneakers', 'price': '$89.99', 'rating': 5 },
            'Electronics': { 'name': 'Sony PlayStation 5', 'price': '$499.99', 'rating': 5 }       

        

    }

    const pm = new PageManager(page);
    await page.waitForTimeout(1500);
    await pm.challengesPages().goToProductListingChallenge()
    await page.waitForTimeout(2000);
   // await pm.productListingChallengePage().getHighestRatingPerCategory()

    const actualHigh = await pm.productListingChallengePage().getHighestRatingPerCategory()

    for (const category in baseRate){
        const expected = baseRate[category as keyof typeof baseRate]
        const actual = actualHigh[category]

        expect(actual.rating).toEqual(expected.rating)

    }

   
  
   
})

test('PLP_004 - Get the most expensive product in each catgory', async ({page})=>{
    const pm = new PageManager(page)
    await page.waitForTimeout(1500);
    await pm.challengesPages().goToProductListingChallenge()
    await page.waitForTimeout(1500);
    const mostPricy = await pm.productListingChallengePage().getMostExpensivePerCategory();
    //console.log(mostPricy)
})

test('PLP_005 - Validate pagination controls', async({page})=>{    
    const expectedProducts = ['Zero to One',  'Haier 1.5 Ton Split AC',  'Instant Pot Duo',  'Apple Watch Series 9',  'Microsoft Xbox Series X','The North Face Jacket',  'Everlast Boxing Gloves',  'The Subtle Art of Not Giving a F*ck',  'Bose QuietComfort 45',  'Uniqlo Ultra Light Down Jacket']
   // console.log('Unsorted:', expectedProducts)
    //console.log('Sorted expected:' , expectedProducts.sort())

    const pm = new PageManager(page)
    await page.waitForTimeout(1500);
    await pm.challengesPages().goToProductListingChallenge()
    await pm.productListingChallengePage().navigateToPageNumber(3)

    const listedProducts = await pm.productListingChallengePage().retrieveProducts()
    //console.log('Unsorted actual: ', await listedProducts.locator('h6.font-semibold').allTextContents())
    //console.log('Sorted actual: ', (await listedProducts.locator('h6.font-semibold').allTextContents()).sort())

    expect ((await listedProducts.locator('h6.font-semibold').allTextContents()).sort()).toEqual(expectedProducts.sort())

    await pm.productListingChallengePage().clickNextButton()
    let paginationButton = page.locator('.MuiPaginationItem-rounded.Mui-selected')
    //console.log("boton: ", await paginationButton.textContent())
    expect(paginationButton).toContainText("4")

    await pm.productListingChallengePage().clickPreviousButton()
    paginationButton = page.locator('.MuiPaginationItem-rounded.Mui-selected')
   //console.log('new boton: ',await paginationButton.textContent())
    expect(paginationButton).toContainText("3")

})

test('PLP_006 - Verify Product Card Details Format', async({page})=>{
    
    const pm = new PageManager(page)

    await pm.challengesPages().goToProductListingChallenge()
    await page.waitForTimeout(1500)

    const nextButton = page.getByRole("button", {name:'Next', exact:true})

    while(true){
        const pageProducts = await pm.productListingChallengePage().retrieveProducts()

        const productCount = await pageProducts.count()
        //console.log(`Hay ${productCount} Productos `)

        for (let i = 0; i < productCount; i++) {

            const currentProduct = pageProducts.nth(i)

            let productName = await currentProduct.locator('.MuiTypography-h6.font-semibold').textContent()
            let productPrice = await currentProduct.locator('.MuiTypography-h6.text-green-600').textContent()
            let productPriceValue = Number(productPrice?.replace('$','').trim())
            let productCat = await currentProduct.locator('.MuiTypography-body2').filter({ hasText: 'Category:' }).textContent()
            let productCatValue = productCat?.replace('Category:','').trim()
            let productStars = await currentProduct.locator('.MuiRating-iconFilled').count()
            let starsStatus = await currentProduct.locator('.MuiRating-root').getAttribute('class')

            expect(starsStatus).toContain('Mui-readOnly')
            expect(productPrice).toContain('$')
            expect(productName).not.toBe('')
            expect(productCatValue).not.toBe('')
            expect(typeof productPriceValue).toBe('number')
           
        }


        const buttonClass = await nextButton.getAttribute('class')
       /* console.log('------------------------------')
        console.log('CLASE DEL BOTON: ', buttonClass)*/
        const isLastPage = buttonClass?.includes("Mui-disabled");

        if (isLastPage) {
            //console.log('Is last Page')
            break;

        }


        await page.waitForTimeout(1000);
        await pm.productListingChallengePage().clickNextButton();
        await page.waitForTimeout(2000);


 
    }

   
   
})