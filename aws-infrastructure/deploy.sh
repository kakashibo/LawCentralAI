#!/bin/bash

# LawCentral AI - AWS Infrastructure Deployment Script
# This script deploys the complete ECS Fargate infrastructure using CloudFormation

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
PROJECT_NAME="lawcentral-ai"
ENVIRONMENT="production"
AWS_REGION="us-east-1"  # Change this to your preferred region
GITHUB_OWNER="kakashibo"
GITHUB_REPO="LawCentralAI"
GITHUB_BRANCH="main"

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

print_status "Starting LawCentral AI infrastructure deployment..."
print_status "Project: $PROJECT_NAME"
print_status "Environment: $ENVIRONMENT"
print_status "Region: $AWS_REGION"

# Get user inputs
read -p "Enter your database password (8+ characters): " -s DB_PASSWORD
echo
if [ ${#DB_PASSWORD} -lt 8 ]; then
    print_error "Database password must be at least 8 characters long."
    exit 1
fi

read -p "Enter your GitHub personal access token: " -s GITHUB_TOKEN
echo
if [ -z "$GITHUB_TOKEN" ]; then
    print_error "GitHub token is required."
    exit 1
fi

read -p "Enter your domain name (optional, press Enter to skip): " DOMAIN_NAME

# Deploy Network Stack
print_status "Deploying network infrastructure..."
aws cloudformation deploy \
    --template-file 01-network.yaml \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-network \
    --parameter-overrides \
        ProjectName=$PROJECT_NAME \
        Environment=$ENVIRONMENT \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $AWS_REGION

if [ $? -eq 0 ]; then
    print_success "Network stack deployed successfully"
else
    print_error "Network stack deployment failed"
    exit 1
fi

# Deploy Database Stack
print_status "Deploying database infrastructure..."
aws cloudformation deploy \
    --template-file 02-database.yaml \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-database \
    --parameter-overrides \
        ProjectName=$PROJECT_NAME \
        Environment=$ENVIRONMENT \
        DatabasePassword=$DB_PASSWORD \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $AWS_REGION

if [ $? -eq 0 ]; then
    print_success "Database stack deployed successfully"
else
    print_error "Database stack deployment failed"
    exit 1
fi

# Deploy ECS Stack
print_status "Deploying ECS infrastructure..."
ECS_PARAMS="ProjectName=$PROJECT_NAME Environment=$ENVIRONMENT"
if [ ! -z "$DOMAIN_NAME" ]; then
    ECS_PARAMS="$ECS_PARAMS DomainName=$DOMAIN_NAME"
fi

aws cloudformation deploy \
    --template-file 03-ecs.yaml \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-ecs \
    --parameter-overrides $ECS_PARAMS \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $AWS_REGION

if [ $? -eq 0 ]; then
    print_success "ECS stack deployed successfully"
else
    print_error "ECS stack deployment failed"
    exit 1
fi

# Deploy CI/CD Stack
print_status "Deploying CI/CD pipeline..."
aws cloudformation deploy \
    --template-file 04-cicd.yaml \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-cicd \
    --parameter-overrides \
        ProjectName=$PROJECT_NAME \
        Environment=$ENVIRONMENT \
        GitHubOwner=$GITHUB_OWNER \
        GitHubRepo=$GITHUB_REPO \
        GitHubBranch=$GITHUB_BRANCH \
        GitHubToken=$GITHUB_TOKEN \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $AWS_REGION

if [ $? -eq 0 ]; then
    print_success "CI/CD stack deployed successfully"
else
    print_error "CI/CD stack deployment failed"
    exit 1
fi

# Get outputs
print_status "Retrieving deployment information..."

# Get Load Balancer DNS
LB_DNS=$(aws cloudformation describe-stacks \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-ecs \
    --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
    --output text \
    --region $AWS_REGION)

# Get ECR Repository URI
ECR_URI=$(aws cloudformation describe-stacks \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-ecs \
    --query 'Stacks[0].Outputs[?OutputKey==`ECRRepositoryURI`].OutputValue' \
    --output text \
    --region $AWS_REGION)

# Get Application URL
APP_URL=$(aws cloudformation describe-stacks \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-ecs \
    --query 'Stacks[0].Outputs[?OutputKey==`ApplicationURL`].OutputValue' \
    --output text \
    --region $AWS_REGION)

# Get Database Endpoint
DB_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-database \
    --query 'Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue' \
    --output text \
    --region $AWS_REGION)

# Get Pipeline Name
PIPELINE_NAME=$(aws cloudformation describe-stacks \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-cicd \
    --query 'Stacks[0].Outputs[?OutputKey==`CodePipelineName`].OutputValue' \
    --output text \
    --region $AWS_REGION)

echo ""
echo "=================================================="
print_success "🎉 Deployment Complete!"
echo "=================================================="
echo ""
print_status "Infrastructure Details:"
echo "  📍 Region: $AWS_REGION"
echo "  🌐 Application URL: $APP_URL"
echo "  🔗 Load Balancer DNS: $LB_DNS"
echo "  🗄️  Database Endpoint: $DB_ENDPOINT"
echo "  📦 ECR Repository: $ECR_URI"
echo "  🚀 Pipeline Name: $PIPELINE_NAME"
echo ""
print_status "Next Steps:"
echo "  1. Push your code to GitHub to trigger the first deployment"
echo "  2. Monitor the pipeline: https://console.aws.amazon.com/codesuite/codepipeline/pipelines/$PIPELINE_NAME/view"
echo "  3. Check ECS service: https://console.aws.amazon.com/ecs/home?region=$AWS_REGION"
echo "  4. View application logs in CloudWatch"
echo ""

if [ ! -z "$DOMAIN_NAME" ]; then
    print_warning "SSL Certificate Setup Required:"
    echo "  1. Go to AWS Certificate Manager console"
    echo "  2. Find the certificate for $DOMAIN_NAME"
    echo "  3. Add the DNS validation records to your domain"
    echo "  4. Wait for certificate validation to complete"
    echo ""
fi

print_status "Useful AWS CLI Commands:"
echo "  # View ECS service status"
echo "  aws ecs describe-services --cluster ${PROJECT_NAME}-${ENVIRONMENT}-cluster --services ${PROJECT_NAME}-${ENVIRONMENT}-service --region $AWS_REGION"
echo ""
echo "  # View pipeline status"
echo "  aws codepipeline get-pipeline-state --name $PIPELINE_NAME --region $AWS_REGION"
echo ""
echo "  # View application logs"
echo "  aws logs tail /ecs/${PROJECT_NAME}-${ENVIRONMENT} --follow --region $AWS_REGION"
echo ""

print_success "Deployment completed successfully! 🚀"
