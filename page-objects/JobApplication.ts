import {Page} from '@playwright/test'
import path from 'path'
import { helperBase } from './helperBase';
import { error } from 'console';


export class JobApplication extends helperBase{
    constructor(page:Page){
        super (page)
    }


   async fillPersonalFields(salut:string, fName: string, lName:string, eMail:string, mobile:string, gender:string, langs:string){

        await this.page.getByRole("textbox", {name:"salutation"}).fill(salut)
        const firstName = this.page.getByRole("textbox", {name:"First Name"})
        await firstName.fill(fName)
        await this.page.getByRole("textbox", {name:"Last Name"}).fill(lName)
        await this.page.locator("input[name='email']").fill(eMail)
        await this.page.locator("input[name='mobile']").fill(mobile)
        await this.page.locator(`input[name="gender"][value="${gender}"]`).check()
        await this.page.locator("span", {hasText:`${langs}`}).check()
        
    }

    async enterSkills(skills:Array<string>){
        for(let skill of skills){
            console.log(skill)
            await this.page.locator(".MuiInputBase-root").getByRole('textbox',{name:'Skill'}).fill(skill)
            await this.page.keyboard.press('Enter')
        }


    }

    async fillResume(fileName: string){
        // __dirname es la carpeta donde vive este archivo de Page Object
        // '..' sube a la raíz del proyecto
        // luego entra a la ruta correcta
        const filePath = path.resolve(__dirname, '..', 'tests', 'resources', fileName);
        await this.page.setInputFiles("input[type='file']", filePath)
        
    }

    async getJobRoles(){

        await this.page.locator('div[id="mui-component-select-jobRoles"]').click()
        const roles = this.page.locator('.MuiMenu-list li')
        /*console.log(await roles.count())
        console.log(await roles.allTextContents())
        for(let i=0; i < await roles.count();i++){
            console.log(await roles.nth(i).textContent())
        }*/

        return roles
      
    }

    async selectRating(value:number){
        const sliderBox = this.page.locator('.MuiSlider-root')
        const sliderCoordinates = await sliderBox.boundingBox()

        if (!sliderCoordinates) {
            throw error("Slider NOT AVAILABLE")
        }


        let targetX = sliderCoordinates.x + (sliderCoordinates.width * (value*.1))
        
        
        const slider = this.page.locator('span[data-index="0"]')
      

      
        await slider.hover()
        await this.page.mouse.down()
        await this.page.mouse.move(targetX, 0)
        await this.page.mouse.up()

    }

    async selectDate(date:string){
       const [month, day, year] = date.split('/')
     
      await this.page.locator('input[type="date"]').fill(date)
       
    }

    async selectTime(time:string){
        await this.page.locator('input[type="time"]').fill(time)
    }

    async selectTerms(){
        await this.page.locator('span', {hasText:'I accept'}).check()
    }


}