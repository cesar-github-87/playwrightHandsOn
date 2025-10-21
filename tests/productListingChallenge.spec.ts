import {test, expect} from '@playwright/test';
import { PageManager } from '../page-objects/PageManager';

test.beforeEach(async({page})=>{
    await page.goto("https://www.cnarios.com/challenges");
    //await page.waitForLoadState("domcontentloaded" )
})


test ("Going to Product Listing Challenge page", async({page})=>{
    const pm = new PageManager(page);
    await page.waitForTimeout(1500);    
    await pm.challengesPages().goToProductListingChallenge();
    await page.waitForTimeout(1500);
    expect (await pm.productListingChallengePage().getPageTitle()).toBe('E-commerce Product Listing & Pagination');
    

})