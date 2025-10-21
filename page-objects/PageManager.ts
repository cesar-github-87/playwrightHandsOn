/*Importa todos los archivos de codigo para gestionar e inicializar las clases 
    de paginas que seran usadas en las pruebas*/

import {Page} from "@playwright/test";
import { ChallengesPage } from "./ChallengesPage";    


export class PageManager{
    private readonly page:Page;
    private readonly challengesPage: ChallengesPage;

    constructor(page:Page){
        this.page = page;
        this.challengesPage = new ChallengesPage(this.page);
    }

    challengesPages(){
        return this.challengesPage;
    }
}

