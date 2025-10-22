import {test, expect} from '@playwright/test';
import { PageManager } from '../page-objects/PageManager';

/* 
- Create a login form with username and password fields
- Validate that empty fields show an error
- Show error message on invalid credentials
- Render user dashboard after login with User credentials
- Render admin dashboard after login with Admin credentials
- Implement logout that resets the state and returns to login page

*/

test.beforeEach(async ({page})=>{
   await page.goto('https://www.cnarios.com/challenges');
   const pm = new PageManager(page);
    await page.waitForTimeout(1500);
    await pm.challengesPages().gotoRoleLoginChallenge();
    await page.waitForTimeout(1500);
    expect(await pm.loginChallengePage().getPageTitle()).toBe("Role-Based Login Flow");
})



test("LF_001 - Empty fields validation", async({page})=>{
    const pm = new PageManager(page);
    await pm.loginChallengePage().loginFormFill("","");
    await pm.loginChallengePage().loginFormClick();
    

    let errorMessage = page.locator('.MuiCardContent-root').locator('.MuiPaper-root').locator('.MuiAlert-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Both fields are required.")
    await page.waitForTimeout(1500);

    page.reload();
    await page.waitForTimeout(1500);

    await pm.loginChallengePage().loginFormFill("user","");
    await pm.loginChallengePage().loginFormClick();

    await page.waitForTimeout(1500);
    
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Both fields are required.")

    await page.waitForTimeout(1500);

    await page.reload();
    await page.waitForTimeout(1500);

    await pm.loginChallengePage().loginFormFill("","password");
    await pm.loginChallengePage().loginFormClick();

    await page.waitForTimeout(1500);   
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Both fields are required.")
})

test("LF_002 - Invalid Credentials", async({page})=>{
    const pm = new PageManager(page);
    await pm.loginChallengePage().loginFormFill("user", "admin123");
    await pm.loginChallengePage().loginFormClick();

    const errorMessage = page.locator('.MuiCardContent-root').locator('.MuiPaper-root').locator('.MuiAlert-message');
    await errorMessage.waitFor();
    await expect(errorMessage).toContainText("Invalid username or password.");

  
})

test.describe('Login scenarios', ()=>{
    test("LF_003 - Login as User",async  ({page})=>{
        const pm = new PageManager(page);
        await pm.loginChallengePage().loginFormFill("user", 'user123');
        await pm.loginChallengePage().loginFormClick();

        const welcomeMessage = page.locator('.MuiTypography-h5');
        await expect(welcomeMessage).toContainText("Welcome, user");

        const dashboardRole = page.locator('.MuiCardContent-root .text-center').locator('.MuiTypography-body1')
        const roleInfo = page.locator('.MuiCardContent-root .text-center').locator('.MuiTypography-body2')
        //console.log(await roleInfo.locator('.MuiTypography-body1').textContent())
        //console.log(await roleInfo.locator('.MuiTypography-body2').textContent())
        
        await expect(roleInfo).toHaveText("Explore features and enjoy the application.")
        await expect(dashboardRole).toHaveText("User Dashboard")
    })


    test("LF_004 - Login as Admin",async  ({page})=>{
        const pm = new PageManager(page);
        await pm.loginChallengePage().loginFormFill("admin", 'admin123');
        await pm.loginChallengePage().loginFormClick();

        const welcomeMessage = page.locator('.MuiTypography-h5');
        await expect(welcomeMessage).toContainText("Welcome, admin");

        const dashboardRole = page.locator('.MuiCardContent-root .text-center').locator('.MuiTypography-body1')
        const roleInfo = page.locator('.MuiCardContent-root .text-center').locator('.MuiTypography-body2')
        
        
        await expect(roleInfo).toHaveText("Manage users, settings, and view system reports.")
        await expect(dashboardRole).toHaveText("Admin Dashboard")
        
    })

    test.afterEach(async({page})=>{
        //const pm = new PageManager(page);
        await page.getByRole('button', {name:'Logout'}).click()
        expect(await page.locator('.MuiTypography-h4').textContent()).toBe("Role-Based Login Flow");
    })
})