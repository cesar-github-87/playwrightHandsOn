import { Page, Locator} from '@playwright/test';
import { helperBase } from './helperBase';  
import { privateDecrypt } from 'crypto';


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
                
          
            }

            const counts :{[key:string]:number}={} //creo un objecto vacio con elementos cuyos keys son string y valor es number
            
            //itera cada element de mi array en un objeto key:number                                            
     
            for (let i = 0; i < allCategories.length; i++) {
                const element = allCategories[i];
                if (counts[element]) {
                    counts[element] += 1;  // If exists, add 1
                } else {
                    counts[element] = 1;   // If new, set to 1
                }
            }
            console.log("Objeto regresado", counts)
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
     
    }

    async groupProducts(){        
    /*
      - Declarar un objecto que tenga categoria, precio y estrellas      
      - Sacar el locator de las tarjetas 
      - HAcer un loop que recorra las tarjetas
            - Sacar el locator de la categoria, precio y estrellas
            - Hacer un loop que en cada tarjeta, agregue la categoria y estrellas al objeto
    */

         //este es un objeto con un array de objectos   
        const groupedProducts:{
            [category: string]:{
                name:string,
                price: number,
                rating: number
            }[]
        }={}

        //let buttonClass = await this.nextButton.getAttribute('class');

        while(true){
                const productCard = this.page.locator('.MuiCardContent-root')
                const productCount = await productCard.count()
                //console.log(`Hay ${productCount} productos`)

                for(let i = 0;i<productCount;i++){
                    const currentCard = productCard.nth(i)
                    const name =  await currentCard.locator('.MuiTypography-h6.font-semibold').textContent();
                    const productCategory = await currentCard.locator('.MuiTypography-body2',{hasText:'Category:'}).textContent();
                    const categoryText = productCategory?.replace('Category:','').trim()
                    const productPrice =  await currentCard.locator('.MuiTypography-h6', {hasText:'$'}).textContent()
                    const priceText = productPrice?.replace('$', '').trim()
                    const productRate = currentCard.locator('.MuiRating-iconFilled')
                    const rating = await productRate.count()

                    /**
                     * Este IF verifica que si cualquiera de los atributos de mi producto
                     * NO existen o estan vacíos, me continúo al siguiente producto del ciclo FOR
                     */
                    if (!categoryText || categoryText=== '' || !name || !priceText) {
                        console.log(`Skipping product ${i} - missing category or name`);
                        continue;
                    }
                
                    
                
                    //Si no existe dicha categoria, lo creo
                    if(!groupedProducts[categoryText]){
                        groupedProducts[categoryText] = [];
                      
                    }
                    groupedProducts[categoryText].push({
                        name, price:Number(priceText), rating
                    })
                  

                }
            const buttonClass = await this.nextButton.getAttribute('class')
            console.log('------------------------------')
            console.log('CLASE DEL BOTON: ', buttonClass)
            const isLastPage = buttonClass?.includes("Mui-disabled");
        
            if (isLastPage) {
               console.log('Is last Page')
               break;
                
            }
            await this.page.waitForTimeout(1000);
            console.log('Current Page":', await this.getCurrentPage())
            await this.clickNextButton();                
            await this.page.waitForTimeout(2000);

        }

            //console.log('Gruped Products:', groupedProducts);
            return groupedProducts;
        
    }

    async getHighestRatingPerCategory(){
        
        const groups = await this.groupProducts()
        const arrayGroup = Object.entries(groups) //Convierte el objecto a un array para poderme mover por el,
        //                                          en este caso son arrays de dos elementos donde el primero es un string (categoria) y el segundo elemento es un objeto
        /*
        [
            ['Books',[{name: 'Book A', rating: 3}, {name: 'Book B', rating: 5}]],
            ['Electronics', [{name: 'Phone', rating: 4}]]
        ]
        */

        //console.log((arrayGroup[4][1][3]))

       
        const highestRatedObject : { [key: string]: any } = {} //estoy declarando un objecto vecio cuya key sera un string y que tendrá valores de cualquier tipo

        arrayGroup.forEach(([cate, prod])=>{ //Por cada elemento en mi arreglo arrayGroup de-estructura de tal manera que cate = Book y prod = [array de objectos Book]
                                                                                                                    //    cate = Clothing y prod = [array de objectos Clothing]

            //.reduce(acumulador, current){}.... recorre un array, siendo 'current' el valor que va iterando el array y 'acumulador' retiene el valor que se actualiza con cada iteracion.
            const highestRate = prod.reduce((higher, current)=>{
                if(current.rating>higher.rating){
                    return current //Current producto es mejor
                }else{
                    return higher //actualiza con el mas alto
                }
            })

            highestRatedObject[cate] =  highestRate
               
        })
           // console.log(highestRated)
        return highestRatedObject
    }

    async getMostExpensivePerCategory(){
        const groupedProducts = await this.groupProducts()
       // console.log(groupedProducts)
        const arrayGroup =  Object.entries(groupedProducts)

        const mostExpensiveObject : {[key: string]: any} = {}

        arrayGroup.forEach(([cat, prod])=>{
            const mostPricy = prod.reduce((accum, current)=>{
                if(current.price > accum.price){
                    return current
                }else{
                    return accum
                }
           })
           mostExpensiveObject[cat] = mostPricy
        })

        return mostExpensiveObject

    }
        

       

    

    async navigateThroughPages(){
         let buttonClass = await this.nextButton.getAttribute('class'); //reviso el atributo CLASS
        
            while (!buttonClass?.includes("Mui-disabled")){            //mientras no tenga el Mui-Disabled, hago lo siguiente
              
                console.log('IM IN - ', await this.getCurrentPage())
                await this.page.waitForTimeout(1000)
                await this.clickNextButton()
                await this.page.waitForTimeout(1000)
                buttonClass = await this.nextButton.getAttribute('class')
                
          
            }

            return true

    }

}