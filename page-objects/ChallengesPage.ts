import {Locator, Page} from '@playwright/test';
import {helperBase} from "./helperBase";
/*
Se declaran los Locators y Funciones que sirven para poder navegar entre las páginas deseadas.
- En el Constructor de inicializan los Locators
- Funciones para ir a la pagina deseada
- Se declara export para que pueda ser usada por los tests
- Extiende HelperBase.ts para poder hacer uso de sus métodos
    KEEP IT STUPID SIMPLE: Se recomienda que los Locators sean inicializados en las funciones y no en el constructor 
    porque es posible que exista una cantidad muy grande de locators y eso dificultaria su posterior debug
*/ 

export class ChallengesPage extends helperBase{


    constructor(page:Page){
        super(page);
    }
    

    async goToProductListingChallenge(){
        console.log(this.page.url())
        
        const listingChallenge = this.page.locator('.MuiCard-root', {has: this.page.getByText('E-commerce Product Listing & Pagination', {exact:true})});           
        await listingChallenge.getByRole('button', {name:'View Challenge'}).click();        

    }

    async gotoProductFilteringChallenge(){
        const filterChallenge = this.page.locator('.MuiCard-root', {has: this.page.getByText('E-commerce Product Filtering & Search', {exact:true})});
        await filterChallenge.click();
    }

    async gotoRoleLoginChallenge(){
        const roleLoginChallenge =  this.page.locator('.MuiCard-root',{has: this.page.getByText('Role-Based Login Flow', {exact:true})})
        await roleLoginChallenge.click();
    }

    async goToEnd2EndChallenge(){
        const e2eChallenge =  this.page.locator('.MuiCard-root',{has: this.page.getByText('E-commerce End-to-End Product Purchasing Flow', {exact:true})})
        await e2eChallenge.click();
    }

    async goToSocialChallenge(){
        const socialMediaChallenge =  this.page.locator('.MuiCard-root',{has: this.page.getByText('Social Media Feed Interaction Challenge', {exact:true})})
        socialMediaChallenge.click();

    }

    async goToShadowDOMChallenge(){
        const shadowDOMChallenge = this.page.locator('.MuiCard-root', {has: this.page.getByText('Shadow DOM Login Form Interaction Challenge', {exact:true})});
        shadowDOMChallenge.click();
    }

    async goToSearchEngineChallenge(){
        const searchEngineChallenge = this.page.locator('.MuiCard-root', {has: this.page.getByText('Simple Search Engine UI Automation Challenge', {exact: true})});
        searchEngineChallenge.click();
    }

    async goToJobAppChallenge(){
        const jobAppChallenge = this.page.locator('.MuiCard-root', {has: this.page.getByText('Job Application Form Automation Challenge', {exact:true})});
        jobAppChallenge.click(); 
    }

    //Just Checking



}