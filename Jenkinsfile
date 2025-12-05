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
            steps {
                dir('/var/jenkins_home/workspace/PW-CNARIOS-TESTS') {
                    sh '''
                    docker run --rm \
                        -e CI=true \
                        -v $(pwd)/playwright-report:/cnarios/playwright-report \
                        playwright-tests \
                        npx playwright test --reporter=html  # ← SIMPLE!
                    '''
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