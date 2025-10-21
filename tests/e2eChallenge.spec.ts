import {test, expect} from '@playwright/test';
import {PageManager} from '../page-objects/PageManager'

test.beforeEach(async({page})=>{
    page.goto('https://www.cnarios.com/challenges/')
})

test('Into e2e Challenge page',async ({page})=>{
    const pm = new PageManager(page);
    await pm.challengesPages().goToEnd2EndChallenge();
    await page.waitForTimeout(1500);
    expect(await pm.e2eChallengePage().getPageTitle()).toBe("E-commerce End-to-End Product Purchasing Flow");
    
})