import {test, expect} from '@playwright/test';
import { PageManager } from '../page-objects/PageManager';

test.beforeEach(async({page})=>{
    await page.goto("https://www.cnarios.com/challenges")
    //await page.waitForLoadState("domcontentloaded" )
})


test ("Going to the first test", async({page})=>{
    const pm = new PageManager(page);
    //await page.waitForTimeout(1500);
    await pm.challengesPages().goToProductListingChallenge();
})