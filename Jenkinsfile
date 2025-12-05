// Location: C:\Users\Cesar\Playwright\PW-CNARIOS-TESTS\Jenkinsfile
pipeline {
    agent any
    
    options {
        timeout(time: 30, unit: 'MINUTES') 
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Since we mount the folder, we don't need git checkout
                dir('/var/jenkins_home/workspace/PW-CNARIOS-TESTS') {
                    sh 'pwd && ls -la'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                dir('/var/jenkins_home/workspace/PW-CNARIOS-TESTS') {
                    script {
                        docker.build("playwright-tests:${env.BUILD_ID}")
                    }
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('/var/jenkins_home/workspace/PW-CNARIOS-TESTS') {
                    script {
                        sh '''
                        docker run --rm \
                            -v $(pwd)/playwright-report:/cnarios/playwright-report \
                            playwright-tests:${BUILD_ID} \
                            npx playwright test --reporter=html --no-server
                        '''
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
                        reportName: 'Playwright Test Report'
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
