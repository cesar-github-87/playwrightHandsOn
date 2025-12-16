pipeline {
    agent any
    
    options {
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        stage('Checkout') {
            steps {
                dir('/var/jenkins_home/workspace/PW-CNARIOS-TESTS') {
                    sh '''
                    echo "Current directory: $(pwd)"
                    ls -la
                    '''
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                dir('/var/jenkins_home/workspace/PW-CNARIOS-TESTS') {
                    sh 'docker build -t playwright-tests .'
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Chrome Tests'){
                    steps {
                       dir('/var/jenkins_home/workspace/PW-CNARIOS-TESTS') {
                            sh 'chmod -R a+rX .'
                            sh '''
                                docker run --rm \
                                    -e CI=true \
                                    -v $(pwd):/cnarios \
                                    -w /cnarios \
                                    playwright-tests \
                                    npx playwright test --project=chromium --update-snapshots --config=playwright.config.ts
                                '''
                        }
                    }
                }
                stage('Firefox Tests'){
                    steps {
                        dir('/var/jenkins_home/workspace/PW-CNARIOS-TESTS') {
                            sh 'chmod -R a+rX .'
                            sh '''
                                docker run --rm \
                                    -e CI=true \
                                    -v $(pwd):/cnarios \
                                    -w /cnarios \
                                    playwright-tests \
                                    npx playwright test --project=firefox --update-snapshots --config=playwright.config.ts
                                '''
                        }
                    }
                }
                stage('Webkit Tests'){
                    steps {
                       dir('/var/jenkins_home/workspace/PW-CNARIOS-TESTS') {
                            sh 'chmod -R a+rX .'
                            sh '''
                                docker run --rm \
                                    -e CI=true \
                                    -v $(pwd):/cnarios \
                                    -w /cnarios \
                                    playwright-tests \
                                    npx playwright test --project=webkit --update-snapshots --config=playwright.config.ts
                                '''
                        }
                    }
                }
                 

            }
           
        }
        
        stage('Publish Results') {
            when {
                // This ensures the stage runs if the overall build is NOT ABORTED or UNSTABLE (e.g., if tests failed, but the stage didn't crash)
                expression { currentBuild.result != 'ABORTED' } 
                // OR simply force it to run if you expect failure, but want the report published
                // always() 
            }
            steps {
                dir('/var/jenkins_home/workspace/PW-CNARIOS-TESTS') {
                    publishHTML([
                        alwaysLinkToLastBuild: true, 
                        allowMissing: true,
                        reportDir: 'playwright-report/chromium',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Test Report - Chrome',
                        keepAll: true
                    ])
                    publishHTML([
                        alwaysLinkToLastBuild: true, 
                        allowMissing: true,
                        reportDir: 'playwright-report/firefox',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Test Report - Firefox',
                        keepAll: true
                    ])
                    publishHTML([
                        alwaysLinkToLastBuild: true, 
                        allowMissing: true,
                        reportDir: 'playwright-report/webkit',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Test Report - Webkit',
                        keepAll: true
                    ])
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker system prune -f'
        }
    }
}
