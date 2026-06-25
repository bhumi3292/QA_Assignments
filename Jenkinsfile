@NonCPS
def clearCSP() {
    System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "")
}

pipeline {
    agent any

    environment {
        // Ensure these IDs match the 'ID' field in your Jenkins Credentials exactly
        MAILOSAUR_API_KEY = credentials('MAILOSAUR_API_KEY')
        MAILOSAUR_SERVER_ID = credentials('MAILOSAUR_SERVER_ID')
    }

    stages {
        stage('Configure Jenkins Environment') {
            steps {
                echo 'Clearing Content Security Policy...'
                script {
                    clearCSP()
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing testing packages...'
                bat 'npm ci'
                echo 'Installing Playwright Browsers...'
                bat 'npx playwright install --with-deps chromium'
            }
        }
        
        stage('Execute Tests') {
            steps {
                echo 'Running automation framework...'
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
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