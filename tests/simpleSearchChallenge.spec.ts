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

test("SSE_002 - Attempt to search with empty input", async ({page})=>{
/**
 *  Ensure the search input is empty
    Click the search button
    Verify results section remains empty
 */

    const pm = new PageManager(page)
    const searchField = page.getByRole("textbox")
    expect(await searchField.inputValue()).toBe("")
    
       
   // await pm.searchEnginePage().fillSearchBox("")
    await pm.searchEnginePage().clickSearchButton()

    const resultsSection = await pm.searchEnginePage().getResults()
    expect(await resultsSection.first().isVisible()).toBeFalsy()
   // console.log(await resultsSection.count())


})

test("SSE_003 - Re-use old search input after re-render (Stale Element Exception)", async({page})=>{

    /**
    Locate the search input and enter 'Flights to London'
    Click the search button
    Wait for search results to load (input re-renders)
    Attempt to type into the old input handle
    Observe stale element exception
    Recover by re-locating the search input and enter 'Hotels in Paris'
    */


    const pm = new PageManager(page)
    await pm.searchEnginePage().fillSearchBox("Flight To London")
    await pm.searchEnginePage().clickSearchButton()
    const results = await pm.searchEnginePage().getResults()

    await results.first().waitFor({state: 'visible'})

    await pm.searchEnginePage().fillSearchBox('Flight to PARIS')

})

test("SSE_004 - Perform a second valid search after recovery", async({page})=>{
    /**
     * Re-locate the search input
        Enter 'Node.js tutorials'
        Click the search button
        Verify that new results render correctly
     */
    const pm = new PageManager(page)
    await pm.searchEnginePage().fillSearchBox("Node.js tutorials")
    await pm.searchEnginePage().clickSearchButton()
    const results = await pm.searchEnginePage().getResults()
    await results.first().waitFor({state: 'visible'})

    for(let i =0; i<await results.count();i++){
        const title = results.nth(i).getByRole('link')
       // console.log(await title.textContent())
        expect(await title.textContent()).toContain("Node.js")
    }

    //page.close()

})


