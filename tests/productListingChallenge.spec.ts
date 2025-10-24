import {test, expect} from '@playwright/test';
import { PageManager } from '../page-objects/PageManager';

test.beforeEach(async({page})=>{
    await page.goto("https://www.cnarios.com/challenges");
    //await page.waitForLoadState("domcontentloaded" )
})


test ("Going to Product Listing Challenge page", async({page})=>{

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

