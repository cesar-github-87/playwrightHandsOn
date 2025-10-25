import { Page, Locator} from '@playwright/test';
import { helperBase } from './helperBase';  


export class ProductListingPage extends helperBase{

    private nextButton = this.page.getByRole("button", {name:'Next', exact:true})

    constructor(page: Page){
        super(page);
    }

    async getPageTitle(){
        const pageTitle = this.page.locator('.MuiTypography-h4').textContent();
        
        return pageTitle;
    }

    async clickNextButton(){           
        
        await this.nextButton.click();
    
    }

    async countCategories(){

        
        let allCategories: string[] =[]; //creo un array vacio que voy a llenar con lo que encuentre        
        let buttonClass = await this.nextButton.getAttribute('class'); //reviso el atributo CLASS
        
            while (!buttonClass?.includes("Mui-disabled")){            //mientras no tenga el Mui-Disabled, hago lo siguiente
                let categories = await this.page.locator(".MuiCardContent-root", {hasText:"Category:"}).getByRole('paragraph').allTextContents();       
                let catArray = categories.map(item=>item.replace('Category:', '').trim()) //.map() crea un nuevo array a partir del array original. trim elimina cualquier espacio que exista en mi string
                allCategories = allCategories.concat(catArray);
                
                await this.page.waitForTimeout(1000)
                await this.clickNextButton()
                await this.page.waitForTimeout(1000)
                buttonClass = await this.nextButton.getAttribute('class')
                //console.log("Boton status: ", await this.nextButton.isDisabled())
          
            }

            const counts :{[key:string]:number}={} //creo un objecto vacio con elementos cuyos keys son string y valor es number
            
            //itera cada element de mi array en un objeto key:number
                                                //si el elemento del array ha aparecido por primera vez  
                                                // counts["Clothing"] is undefined ← LEFT VALUE
                                                // (undefined || 0) = 0
                                                // 0 + 1 = 1

            //allCategories.forEach(elements => {counts[elements] = (counts[elements]||0)+1})
            for (let i = 0; i < allCategories.length; i++) {
                const element = allCategories[i];
                if (counts[element]) {
                    counts[element] += 1;  // If exists, add 1
                } else {
                    counts[element] = 1;   // If new, set to 1
                }
            }
           // console.log(counts)
            return counts //Regreso el objeto llenado
          

    }
    
    async retrieveProducts(){
        let products:string[]=[]

        products = await this.page.locator('.MuiCardContent-root').locator('h6.font-semibold').allTextContents()
        return products
      //  console.log(products)
    }

    async getCurrentPage(){
        const pageNumber = await this.page.locator('nav').locator('.Mui-selected').textContent();
        return pageNumber
        //console.log(pageNumber)
    }

}