@echo off
setlocal enabledelayedexpansion

REM LawCentral AI - AWS Infrastructure Deployment Script (Windows)
REM This script deploys the complete ECS Fargate infrastructure using CloudFormation

echo.
echo ================================================
echo LawCentral AI - AWS Infrastructure Deployment
echo ================================================
echo.

REM Configuration
set PROJECT_NAME=lawcentral-ai
set ENVIRONMENT=production
set AWS_REGION=us-east-1
set GITHUB_OWNER=kakashibo
set GITHUB_REPO=LawCentralAI
set GITHUB_BRANCH=main

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] AWS CLI is not installed. Please install it first.
    pause
    exit /b 1
)

REM Check if AWS credentials are configured
aws sts get-caller-identity >nul 2>&1
if errorlevel 1 (
    echo [ERROR] AWS credentials are not configured. Please run 'aws configure' first.
    pause
    exit /b 1
)

echo [INFO] Starting LawCentral AI infrastructure deployment...
echo [INFO] Project: %PROJECT_NAME%
echo [INFO] Environment: %ENVIRONMENT%
echo [INFO] Region: %AWS_REGION%
echo.

REM Get user inputs
set /p DB_PASSWORD="Enter your database password (8+ characters): "
if "!DB_PASSWORD!"=="" (
    echo [ERROR] Database password is required.
    pause
    exit /b 1
)

set /p GITHUB_TOKEN="Enter your GitHub personal access token: "
if "!GITHUB_TOKEN!"=="" (
    echo [ERROR] GitHub token is required.
    pause
    exit /b 1
)

set /p DOMAIN_NAME="Enter your domain name (optional, press Enter to skip): "

echo.
echo [INFO] Deploying network infrastructure...
aws cloudformation deploy ^
    --template-file 01-network.yaml ^
    --stack-name %PROJECT_NAME%-%ENVIRONMENT%-network ^
    --parameter-overrides ^
        ProjectName=%PROJECT_NAME% ^
        Environment=%ENVIRONMENT% ^
    --capabilities CAPABILITY_NAMED_IAM ^
    --region %AWS_REGION%

if errorlevel 1 (
    echo [ERROR] Network stack deployment failed
    pause
    exit /b 1
)
echo [SUCCESS] Network stack deployed successfully

echo.
@REM echo [INFO] Deploying database infrastructure...
@REM aws cloudformation deploy ^
@REM     --template-file 02-database.yaml ^
@REM     --stack-name %PROJECT_NAME%-%ENVIRONMENT%-database ^
@REM     --parameter-overrides ^
@REM         ProjectName=%PROJECT_NAME% ^
@REM         Environment=%ENVIRONMENT% ^
@REM         DatabasePassword=%DB_PASSWORD% ^
@REM     --capabilities CAPABILITY_NAMED_IAM ^
@REM     --region %AWS_REGION%
@REM
@REM if errorlevel 1 (
@REM     echo [ERROR] Database stack deployment failed
@REM     pause
@REM     exit /b 1
@REM )
echo [SUCCESS] Database stack deployed successfully

echo.
echo [INFO] Deploying ECS infrastructure...
set ECS_PARAMS=ProjectName=%PROJECT_NAME% Environment=%ENVIRONMENT%
if not "!DOMAIN_NAME!"=="" (
    set ECS_PARAMS=!ECS_PARAMS! DomainName=!DOMAIN_NAME!
)

aws cloudformation deploy ^
    --template-file 03-ecs.yaml ^
    --stack-name %PROJECT_NAME%-%ENVIRONMENT%-ecs ^
    --parameter-overrides !ECS_PARAMS! ^
    --capabilities CAPABILITY_NAMED_IAM ^
    --region %AWS_REGION%

if errorlevel 1 (
    echo [ERROR] ECS stack deployment failed
    pause
    exit /b 1
)
echo [SUCCESS] ECS stack deployed successfully

echo.
echo [INFO] Deploying CI/CD pipeline...
aws cloudformation deploy ^
    --template-file 04-cicd.yaml ^
    --stack-name %PROJECT_NAME%-%ENVIRONMENT%-cicd ^
    --parameter-overrides ^
        ProjectName=%PROJECT_NAME% ^
        Environment=%ENVIRONMENT% ^
        GitHubOwner=%GITHUB_OWNER% ^
        GitHubRepo=%GITHUB_REPO% ^
        GitHubBranch=%GITHUB_BRANCH% ^
        GitHubToken=%GITHUB_TOKEN% ^
    --capabilities CAPABILITY_NAMED_IAM ^
    --region %AWS_REGION%

if errorlevel 1 (
    echo [ERROR] CI/CD stack deployment failed
    pause
    exit /b 1
)
echo [SUCCESS] CI/CD stack deployed successfully

echo.
echo [INFO] Retrieving deployment information...

REM Get outputs
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name %PROJECT_NAME%-%ENVIRONMENT%-ecs --query "Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue" --output text --region %AWS_REGION%') do set LB_DNS=%%i

for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name %PROJECT_NAME%-%ENVIRONMENT%-ecs --query "Stacks[0].Outputs[?OutputKey==`ECRRepositoryURI`].OutputValue" --output text --region %AWS_REGION%') do set ECR_URI=%%i

for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name %PROJECT_NAME%-%ENVIRONMENT%-ecs --query "Stacks[0].Outputs[?OutputKey==`ApplicationURL`].OutputValue" --output text --region %AWS_REGION%') do set APP_URL=%%i

for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name %PROJECT_NAME%-%ENVIRONMENT%-database --query "Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue" --output text --region %AWS_REGION%') do set DB_ENDPOINT=%%i

for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name %PROJECT_NAME%-%ENVIRONMENT%-cicd --query "Stacks[0].Outputs[?OutputKey==`CodePipelineName`].OutputValue" --output text --region %AWS_REGION%') do set PIPELINE_NAME=%%i

echo.
echo ==================================================
echo [SUCCESS] Deployment Complete!
echo ==================================================
echo.
echo [INFO] Infrastructure Details:
echo   Region: %AWS_REGION%
echo   Application URL: !APP_URL!
echo   Load Balancer DNS: !LB_DNS!
echo   Database Endpoint: !DB_ENDPOINT!
echo   ECR Repository: !ECR_URI!
echo   Pipeline Name: !PIPELINE_NAME!
echo.
echo [INFO] Next Steps:
echo   1. Push your code to GitHub to trigger the first deployment
echo   2. Monitor the pipeline: https://console.aws.amazon.com/codesuite/codepipeline/pipelines/!PIPELINE_NAME!/view
echo   3. Check ECS service: https://console.aws.amazon.com/ecs/home?region=%AWS_REGION%
echo   4. View application logs in CloudWatch
echo.

if not "!DOMAIN_NAME!"=="" (
    echo [WARNING] SSL Certificate Setup Required:
    echo   1. Go to AWS Certificate Manager console
    echo   2. Find the certificate for !DOMAIN_NAME!
    echo   3. Add the DNS validation records to your domain
    echo   4. Wait for certificate validation to complete
    echo.
)

echo [INFO] Useful AWS CLI Commands:
echo   # View ECS service status
echo   aws ecs describe-services --cluster %PROJECT_NAME%-%ENVIRONMENT%-cluster --services %PROJECT_NAME%-%ENVIRONMENT%-service --region %AWS_REGION%
echo.
echo   # View pipeline status
echo   aws codepipeline get-pipeline-state --name !PIPELINE_NAME! --region %AWS_REGION%
echo.
echo   # View application logs
echo   aws logs tail /ecs/%PROJECT_NAME%-%ENVIRONMENT% --follow --region %AWS_REGION%
echo.

echo [SUCCESS] Deployment completed successfully!
echo.
pause
