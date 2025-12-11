# LawCentralAI - AWS ECS Fargate CI/CD Deployment Guide

This guide explains how to deploy **LawCentralAI** to AWS using ECS Fargate, CloudFormation stacks in `aws-infrastructure/`, and optionally GitHub Actions.

## Architecture Overview

High-level architecture:

- **GitHub Repository** → **CodePipeline/CodeBuild** → **ECR** → **ECS Fargate Service** (running the Docker image built from this repo)
- Optional **RDS PostgreSQL** database in private subnets
- **Network Load Balancer** or application URL exposed publicly

## Repository Layout

- `frontend/` – Vite React frontend (currently using mock data)
- `backend/` – Express backend listening on port `4000`
- `Dockerfile` – Multi-stage build: frontend → backend
- `aws-infrastructure/`
  - `01-network.yaml` – VPC, subnets, security groups
  - `02-database.yaml` – RDS PostgreSQL + Secrets Manager + SSM
  - `03-ecs.yaml` – ECS Fargate, NLB, autoscaling
  - `04-cicd.yaml` – CodePipeline, CodeBuild, GitHub integration
  - `deploy.sh` / `deploy.bat` – Helper scripts to deploy the stacks

## Prerequisites

1. **AWS account** with billing enabled.
2. **AWS CLI v2** installed and configured:

```bash
aws configure
# Set your AWS Access Key, Secret, default region (e.g. us-east-1) and output format
```

3. **Docker** installed locally (for building and testing images).
4. **GitHub repository**: `https://github.com/kakashibo/LawCentralAI` (origin remote already configured).

## Quick Deployment Using `deploy.sh`

From the repo root:

```bash
cd aws-infrastructure
chmod +x deploy.sh
./deploy.sh
```

The script will:

1. Ask for a **database password** (used by `02-database.yaml`).
2. Ask for a **GitHub personal access token** (used by `04-cicd.yaml` for CodePipeline source integration).
3. Optionally ask for a **domain name** (for ACM certificate + HTTPS).
4. Deploy, in order:
   - Network stack: `lawcentral-ai-production-network`
   - Database stack: `lawcentral-ai-production-database`
   - ECS stack: `lawcentral-ai-production-ecs`
   - CI/CD stack: `lawcentral-ai-production-cicd`

At the end, it prints:

- Application URL (from ECS stack output)
- Load Balancer DNS
- Database endpoint
- ECR repository URI
- CodePipeline name

## Manual CloudFormation Deployment (Optional)

If you prefer manual CLI commands instead of `deploy.sh`, you can run each stack separately from `aws-infrastructure/`:

### 1. Network Stack

```bash
aws cloudformation deploy \
  --template-file 01-network.yaml \
  --stack-name lawcentral-ai-production-network \
  --parameter-overrides \
    ProjectName=lawcentral-ai \
    Environment=production \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

### 2. Database Stack

```bash
aws cloudformation deploy \
  --template-file 02-database.yaml \
  --stack-name lawcentral-ai-production-database \
  --parameter-overrides \
    ProjectName=lawcentral-ai \
    Environment=production \
    DatabasePassword=YourSecurePassword123 \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

### 3. ECS Stack

```bash
aws cloudformation deploy \
  --template-file 03-ecs.yaml \
  --stack-name lawcentral-ai-production-ecs \
  --parameter-overrides \
    ProjectName=lawcentral-ai \
    Environment=production \
    DomainName=yourdomain.com \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

If you do not have a domain yet, you can omit `DomainName` (or leave it blank) and use the Load Balancer DNS.

### 4. CI/CD Stack

```bash
aws cloudformation deploy \
  --template-file 04-cicd.yaml \
  --stack-name lawcentral-ai-production-cicd \
  --parameter-overrides \
    ProjectName=lawcentral-ai \
    Environment=production \
    GitHubOwner=kakashibo \
    GitHubRepo=LawCentralAI \
    GitHubBranch=main \
    GitHubToken=your_github_token \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

## Building and Pushing the Docker Image Manually

Although CodeBuild can build and push images for you, you can also do it locally for testing or to bootstrap the first image.

1. Authenticate Docker to ECR (replace with your account/region):

```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

2. Build the Docker image:

```bash
docker build -t lawcentral-ai .
```

3. Tag and push the image to your ECR repository:

```bash
# Replace REPO_URI with the URI from the ECS stack output
REPO_URI=<ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/lawcentral-ai-production

docker tag lawcentral-ai:latest $REPO_URI:latest

docker push $REPO_URI:latest
```

## GitHub Actions Deployment

This repo includes a GitHub Actions workflow at `.github/workflows/deploy-to-ecs.yml`.

It:

1. Builds the Docker image with the root `Dockerfile`.
2. Pushes it to ECR.
3. Calls `aws ecs update-service --force-new-deployment` to roll out the new image.

To use it:

1. In GitHub **Settings → Secrets and variables → Actions**, set:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `LAWCENTRAL_ECR_REPO` – ECR repo URI
   - `LAWCENTRAL_ECS_CLUSTER` – ECS cluster name
   - `LAWCENTRAL_ECS_SERVICE` – ECS service name
2. Push to `main` or trigger the workflow manually from the **Actions** tab.

## Local Development with Docker Compose

For local testing (with mock frontend data), you can use `docker-compose.yml` in the repo root:

```bash
docker compose up --build
```

This will:

- Build the LawCentralAI image using the same `Dockerfile`.
- Expose the backend on `http://localhost:4000`.
- Set `REACT_APP_API_URL=http://localhost:4000/api` for the frontend.

## Troubleshooting

- **Stack deployment fails** – use CloudFormation events:

```bash
aws cloudformation describe-stack-events \
  --stack-name lawcentral-ai-production-network \
  --region us-east-1
```

- **ECS tasks not starting** – check ECS logs and task definition to ensure:
  - The container port is `4000`.
  - Health check path `/api/health` is responding.

- **Pipeline build fails** – check CodeBuild logs in CloudWatch for the project created by `04-cicd.yaml`.

## Cleanup

To remove all infrastructure, delete stacks in reverse order:

```bash
aws cloudformation delete-stack --stack-name lawcentral-ai-production-cicd --region us-east-1
aws cloudformation delete-stack --stack-name lawcentral-ai-production-ecs --region us-east-1
aws cloudformation delete-stack --stack-name lawcentral-ai-production-database --region us-east-1
aws cloudformation delete-stack --stack-name lawcentral-ai-production-network --region us-east-1
```

You may also need to manually empty any S3 buckets created for pipeline artifacts or application data.
