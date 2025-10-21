import {test, expect} from '@playwright/test';
import { PageManager } from '../page-objects/PageManager';

test.beforeEach(async ({page})=>{
   await page.goto('https://www.cnarios.com/challenges');
})

test('Validate Login Page Title', async({page})=>{
    const pm = new PageManager(page);
    await page.waitForTimeout(1500);
    await pm.challengesPages().gotoRoleLoginChallenge();
    await page.waitForTimeout(1500);
    expect(await pm.loginChallengePage().getPageTitle()).toBe("Role-Based Login Flow");
    
})