package webDriverMethods;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.Set;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WindowType;
import org.openqa.selenium.edge.EdgeDriver;

public class WebDriverMethods {

	@SuppressWarnings("deprecation")
	public static void main(String[] args) throws InterruptedException, MalformedURLException {
		
		
		
		//Abrir varias ventanas y determinar el ID de cada una de esas pantallas
		
		WebDriver driver = new EdgeDriver();
		driver.get("http://mercadolibre.com.mx");
		driver.manage().window().maximize();
		
		Thread.sleep(5000); //Wait 5 sec
		
		//Obtener el URL de un elemento de LINK TEXT y usarlo para abrir un nuevo tab con ese URL
		String ofertasURL = driver.findElement(By.linkText("Ofertas")).getAttribute("href");
		
		driver.switchTo().newWindow(WindowType.TAB); //abro un nuevo tab
		driver.get(ofertasURL);
		
		//abro otros 3 tabs para un total de 5
		driver.switchTo().newWindow(WindowType.TAB); 
		driver.switchTo().newWindow(WindowType.TAB); 
		driver.switchTo().newWindow(WindowType.TAB); 
		
		
		Set<String> windowsIDs = driver.getWindowHandles();
        System.out.println("Estos son los IDs de las 5 páginas abiertas usando tipo SET: " + windowsIDs);
        System.out.println("La cantidad de pestañas abiertas es: " + driver.getWindowHandles().size());
        ArrayList<String> idList = new ArrayList(windowsIDs);
        
       //Me muevo entre los tabs abiertos
        
        for(String winID:idList) {
        	String titulo = driver.switchTo().window(winID).getTitle(); //Estoy obteniendo el titulo de cada una de los tabs en los que me estoy moviendo
        	
        	if(titulo.equals("Ofertas | Mercadolibre México")) {
        		//System.out.println("El ID de la pagina que corresponde es: " + driver);
        		driver.close();
        	}
         }
        System.out.println("La NUEVA cantidad de pestañas abiertas es: " + driver.getWindowHandles().size());

      //  Scanner myObj = new Scanner(System.in);
                
       // System.out.println("Entra el tab a cerrar: " );
      //  int tab = myObj.nextInt();
        
      //  driver.switchTo().window(idList.get(tab)); //AQUI ME MUEVO AL TAB QUE ELEGI
      //  System.out.println("El ID del tab seleccionado es: " + idList.get(tab));
        
        
       // driver.manage().window().wait()
        
       // String parentID = idList.get(0);
        //String childID = idList.get(1);
        
        
        
        
     
     
        
        //EL METODO get() y METODO  navigate().To() HACEN ESENCIALMENTE LO MISMO 
        //get() ACEPTA EL ATRIBUTO EN FORMATO TEXTO
        //navigate().To() ACEPTA EL ATRIBUTO EN TIPO OBJETO URL Y NOS PERMITE USAR COMANDOS DE NAVEGACION> BACK, FORWARD, REFRESH.
        
      // driver.navigate().to
        
        
        
        
        
	}

}
