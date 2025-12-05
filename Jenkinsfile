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
        
        stage('Build Docker Image') {
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
                        sh '''
                        docker run --rm \
                            -e CI=true \
                            -v $(pwd)/playwright-report:/cnarios/playwright-report \
                            playwright-tests \
                            npx playwright test --project=chromium --reporter=html  # ← SIMPLE!
                        '''
                        }
                    }
                }
                stage('Firefox Tests'){
                    steps {
                        dir('/var/jenkins_home/workspace/PW-CNARIOS-TESTS') {
                        sh '''
                        docker run --rm \
                            -e CI=true \
                            -v $(pwd)/playwright-report:/cnarios/playwright-report \
                            playwright-tests \
                            npx playwright test --project=firefox --reporter=html  # ← SIMPLE!
                        '''
                        }
                    }
                }
                stage('Webkit Tests'){
                    steps {
                        dir('/var/jenkins_home/workspace/PW-CNARIOS-TESTS') {
                        sh '''
                        docker run --rm \
                            -e CI=true \
                            -v $(pwd)/playwright-report:/cnarios/playwright-report \
                            playwright-tests \
                            npx playwright test --project=webkit --reporter=html  # ← SIMPLE!
                        '''
                        }
                    }
                }
                 

            }
           
        }
        
        stage('Publish Results') {
            steps {
                dir('/var/jenkins_home/workspace/PW-CNARIOS-TESTS') {
                    publishHTML([
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Test Report',
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
