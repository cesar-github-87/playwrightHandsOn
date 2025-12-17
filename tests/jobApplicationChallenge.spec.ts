import {test, expect} from '@playwright/test'
import { PageManager } from "../page-objects/PageManager"

test.beforeEach(async ({page})=>{
    await page.goto('https://www.cnarios.com/challenges')
    const pm = new PageManager(page)
    await pm.challengesPages().goToJobAppChallenge()

})

test("JAF_001", async ({page})=>{
        /*
    Enter valid salutation, first name, last name, email, and mobile
    Select gender and languages
    Upload a valid .pdf resume
    Add skills using Enter key
    Select multiple job roles
    Set rating slider to 7
    Pick valid date and time
    Check 'I accept terms' checkbox
    Click Submit
    Verify success snackbar message
        */ 

    const pm = new PageManager(page)
    await pm.jobPage().fillPersonalFields("Mr.", "Cesarp", "Barragan", "cesr213@gmail.com", "3333333334", "Female", "English")
    await pm.jobPage().fillResume('Cesar Barragan Resume 2025-11.pdf')
    const roles = await pm.jobPage().getJobRoles()

    //console.log(await roles.allTextContents())

    await page.locator('.MuiMenu-list li').nth(1).click()
    await page.locator('.MuiMenu-list li').nth(3).click()
    await page.locator('.MuiMenu-list li').nth(6).click()

    await page.keyboard.press('Escape')

    await pm.jobPage().selectRating(7)

    await pm.jobPage().selectDate("2026-11-30")
    await pm.jobPage().selectTime('09:25')
    await pm.jobPage().selectTerms()
    await pm.jobPage().enterSkills(["manager", "qa"])
    await page.getByRole('button', {name:'Submit'}).click()

    expect(await page.locator('div[role=presentation] .MuiAlert-message').textContent()).toBe('Application Submitted Successfully!')



})

