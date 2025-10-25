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
        console.log(categoryInfo[key as keyof typeof categoryInfo]);
    });


    const pm = new PageManager(page);
    await page.waitForTimeout(1500);    
    await pm.challengesPages().goToProductListingChallenge();
    await page.waitForTimeout(1500);
    expect (await pm.productListingChallengePage().getPageTitle()).toBe('E-commerce Product Listing & Pagination');


    const countedCategories = await pm.productListingChallengePage().countCategories()
    console.log('Objeto referencia: ', categoryInfo)
    console.log("Objeto leido desde pagina con mis conteos: ", countedCategories)


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
    const targetProduct = "Speedo Swim Goggles"
    const pm =  new PageManager(page)
    await pm.challengesPages().goToProductListingChallenge()
    await page.waitForTimeout(1500)    
    

    let pageProducts = await pm.productListingChallengePage().retrieveProducts()
    let found = false
    let pageNumber
    console.log(pageProducts.length)

    while(!found){
        for(let i=0; i< pageProducts.length;i++){
            
            if(targetProduct === pageProducts[i]){            
                found = true
                pageNumber = await pm.productListingChallengePage().getCurrentPage()
                console.log(`I've found "${targetProduct}" on page "${pageNumber}" in position "${i+1}"` )
                break
            }
        
              
        }
        await pm.productListingChallengePage().clickNextButton()
        await page.waitForTimeout(1500)  
        pageProducts = await pm.productListingChallengePage().retrieveProducts()
    }

    expect(found).toBeTruthy

    

})

