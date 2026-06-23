// Define the nonCPS method at the very top of your file
@NonCPS
def clearCSP() {
    System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "")
}

pipeline {
    agent any

    stages {
        stage('Configure Jenkins Environment') {
            steps {
                echo 'Clearing Content Security Policy for HTML Reports...'
                script {
                    // Call the method safely here
                    clearCSP()
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing testing packages...'
                bat 'npm install'
                echo 'Installing Playwright Browsers...'
                bat 'npx playwright install'
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
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])
        }
    }
}