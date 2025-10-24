FROM mcr.microsoft.com/playwright:v1.56.1-noble
RUN mkdir /cnarios  
WORKDIR /cnarios    
COPY . /cnarios/    
		
RUN npm install --force  
RUN npx playwright install  