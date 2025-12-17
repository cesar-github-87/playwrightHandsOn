/*Importa todos los archivos de codigo para gestionar e inicializar las clases 
    de paginas que seran usadas en las pruebas*/

import {Page} from "@playwright/test";
import { ChallengesPage } from "./ChallengesPage";    
import { ProductListingPage } from "./ProductListingPage";
import { E2EPage } from "./e2ePage";
import { LoginPage } from "./loginChallengePage";
import { FilterSearchPage } from "./filterSearchPage";
import { SocialMedia} from "./socialMediaPage";
import { SearchEngine } from "./SearchEnginePage";
import {JobApplication} from "./JobApplication";




export class PageManager{
    private readonly page:Page;
    private readonly challengesPage: ChallengesPage;
    private readonly productListingPage: ProductListingPage;
    private readonly e2ePage: E2EPage;
    private readonly loginChallPage: LoginPage;
    private readonly filteringPage: FilterSearchPage
    private readonly socialMediaPage: SocialMedia;
    private readonly simpleSearchEnginePage: SearchEngine;
    private readonly jobApplicationPage: JobApplication

    constructor(page:Page){
        this.page = page;
        this.challengesPage = new ChallengesPage(this.page);
        this.productListingPage = new ProductListingPage(this.page);
        this.e2ePage = new E2EPage(this.page);
        this.loginChallPage = new LoginPage(this.page);
        this.filteringPage = new FilterSearchPage(this.page);
        this.socialMediaPage = new SocialMedia(this.page);
        this.simpleSearchEnginePage =  new SearchEngine(this.page);
        this.jobApplicationPage =  new JobApplication(this.page);

    }

    challengesPages(){
        return this.challengesPage;
    }

    productListingChallengePage(){
        return this.productListingPage;

    }

    e2eChallengePage(){
        return this.e2ePage;
    }

    loginChallengePage(){
        return this.loginChallPage;
    }

   filteringSearchPage(){
        return this.filteringPage;
    }

    socialMediaPages(){
        return this.socialMediaPage;
    }

    searchEnginePage(){
        return this.simpleSearchEnginePage;
    }
    
    jobPage(){
        return this.jobApplicationPage;
    }
}

