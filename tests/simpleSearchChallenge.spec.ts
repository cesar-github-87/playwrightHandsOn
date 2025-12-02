import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/PageManager';


test.beforeEach(async({page})=>{
    await page.goto('https://www.cnarios.com/challenges')
    const pm = new PageManager(page)
    await pm.challengesPages().goToSearchEngineChallenge()
    
})

test("SSE_001 - Perform a valid search and verify Results ", async ({page})=>{

    /**
     *  Locate the search input and type 'React Testing'
        Click the search button
        Verify that at least 3 results appear
        Validate each result includes a clickable title, URL, and snippet
     */

    const pm = new PageManager(page)
    await pm.searchEnginePage().fillSearchBox("React Testing")
    expect(await page.getByRole("textbox").inputValue()).toBe("React Testing")  

    await pm.searchEnginePage().clickSearchButton()

    const results = await pm.searchEnginePage().getResults()
    
    await results.first().waitFor({state: 'visible'})
    expect(await results.count()).toBeGreaterThanOrEqual(3)

    for(let i = 0; i < await results.count();i++){
        const title = results.nth(i).getByRole("link")
        expect.soft(await title.getAttribute("href")).not.toBeNull()        
        const urlText = await results.nth(i).locator('.text-green-700').textContent()
        expect.soft(urlText).toContain("https://www.cnarios.com")
        const snipplet = await results.nth(i).locator('.text-slate-700').textContent()
        expect.soft(snipplet).not.toBeNull()
    }

})
