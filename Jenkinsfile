@NonCPS
def clearCSP() {
    System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "")
}

pipeline {
    agent any

    environment {
        MAILOSAUR_API_KEY = credentials('MAILOSAUR_API_KEY')
        MAILOSAUR_SERVER_ID = credentials('MAILOSAUR_SERVER_ID')
    }

    stages {
        stage('Configure Jenkins Environment') {
            steps {
                script { clearCSP() }
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
                bat 'npx playwright install --with-deps chromium'
            }
        }
        
        stage('Execute Tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            
            node('built-in') {
                echo 'Publishing Playwright HTML Test Report...'
                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright HTML Report'
                ])
            }
        }
    }
}