# minhdqdev_website Deployment Guide

## Overview
This document describes the CI/CD pipeline and deployment setup for the minhdqdev_website project to the UAT environment.

## Architecture

### Deployment Stack
- **Platform**: Kubernetes cluster in `minhdq-uat` namespace
- **Container Registry**: Harbor (`harbor.minhdq.dev/minhdqdev/minhdqdev-website`)
- **GitOps**: ArgoCD with Image Updater
- **Domain**: `uat.minhdq.dev`

## CI/CD Pipeline

### GitHub Workflow (`.github/workflows/ci-dev.yml`)
- **Trigger**: Push to `develop` branch
- **Actions**:
  1. Extract version from `package.json`
  2. Build multi-stage Docker image
  3. Push to Harbor with tags:
     - `develop` (latest)
     - `develop-{BUILD_NUMBER}` (specific build)
  4. Use build cache for faster builds

### Requirements
GitHub repository secrets:
- `HARBOR_USERNAME`: Harbor registry username
- `HARBOR_PASSWORD`: Harbor registry password

### Runner
Uses self-hosted runner with labels: `[self-hosted, minhdqdev, personal]`
- Deployed in `minhdqdev-runners` namespace
- Has access to internal Harbor registry
- Dedicated to `minhdqdev/minhdqdev_website` repository

## Docker Configuration

### Dockerfile
Multi-stage build optimized for Next.js:
1. **deps**: Install dependencies (production + dev)
2. **builder**: Build Next.js application with standalone output
3. **runner**: Minimal runtime image with built assets

### Key Environment Variables
- `STANDALONE=1`: Enables Next.js standalone output mode
- `NEXT_TELEMETRY_DISABLED=1`: Disables Next.js telemetry
- `PORT=3000`: Application port

## ArgoCD Configuration

### Application Manifest
Location: `automation/minhdqdev-argocd-config/apps/uat/minhdqdev-website.yaml`

### Image Updater Configuration
- **Pattern**: `^develop-[0-9]+$`
- **Strategy**: Latest matching tag
- **Pull Secret**: `harbor-minhdqdev` in `minhdq-uat` namespace

### Kubernetes Resources
Located in: `automation/minhdqdev-argocd-config/environments/uat/minhdqdev-website/`

- **namespace.yaml**: Namespace definition
- **deployment.yaml**: 1 replica with minimal resources
  - CPU: 50m request, 200m limit
  - Memory: 128Mi request, 256Mi limit
- **service.yaml**: ClusterIP service on port 80
- **ingress.yaml**: Nginx ingress for `uat.minhdq.dev`
- **kustomization.yaml**: Kustomize configuration for image management

## Deployment Flow

1. Developer pushes to `develop` branch
2. GitHub Actions workflow triggers
3. Docker image is built and pushed to Harbor with `develop-{BUILD_NUMBER}` tag
4. ArgoCD Image Updater detects new image
5. Image tag is updated in git repository
6. ArgoCD syncs changes to Kubernetes cluster
7. Application is deployed to `minhdq-uat` namespace
8. Website is accessible at `http://uat.minhdq.dev`

## Resource Specifications

### Deployment
- **Replicas**: 1
- **Container Port**: 3000
- **Readiness Probe**: HTTP GET `/` every 10s (delay: 10s)
- **Liveness Probe**: HTTP GET `/` every 20s (delay: 30s)

### Resource Limits
```yaml
requests:
  cpu: 50m
  memory: 128Mi
limits:
  cpu: 200m
  memory: 256Mi
```

## Manual Operations

### Build Docker Image Locally
```bash
docker build -t harbor.minhdq.dev/minhdqdev/minhdqdev-website:local .
```

### Test Container Locally
```bash
docker run -p 3000:3000 harbor.minhdq.dev/minhdqdev/minhdqdev-website:local
```

### Deploy Manually via kubectl
```bash
kubectl apply -k automation/minhdqdev-argocd-config/environments/uat/minhdqdev-website/
```

### Check Deployment Status
```bash
kubectl -n minhdq-uat get pods -l app.kubernetes.io/name=minhdqdev-website
kubectl -n minhdq-uat logs -l app.kubernetes.io/name=minhdqdev-website --tail=100
```

### Force ArgoCD Sync
```bash
argocd app sync minhdqdev-website-uat
```

## Troubleshooting

### Image Pull Errors
Verify Harbor pull secret exists:
```bash
kubectl -n minhdq-uat get secret harbor-minhdqdev
```

### Pod Not Starting
Check logs and events:
```bash
kubectl -n minhdq-uat describe pod -l app.kubernetes.io/name=minhdqdev-website
kubectl -n minhdq-uat logs -l app.kubernetes.io/name=minhdqdev-website
```

### Ingress Not Working
Verify ingress configuration:
```bash
kubectl -n minhdq-uat get ingress minhdqdev-website
kubectl -n minhdq-uat describe ingress minhdqdev-website
```

### ArgoCD Out of Sync
Check ArgoCD application status:
```bash
argocd app get minhdqdev-website-uat
argocd app diff minhdqdev-website-uat
```

## Migration Notes

### Repository Notes
This repository is kept as a personal public repository on `minhdqdev/minhdqdev_website`.
- Uses self-hosted runner for internal Harbor access
- Runner deployed in `minhdqdev-runners` Kubernetes namespace
- ArgoCD configuration is in `minhdqdev-org/minhdqdev-argocd-config`
- No migration to organization needed

### Runner Management
To check runner status:
```bash
kubectl -n minhdqdev-runners get pods
kubectl -n minhdqdev-runners get runnerdeployments
```

To scale runners:
```bash
kubectl -n minhdqdev-runners scale runnerdeployment minhdqdev-runners --replicas=2
```

## Next Steps

1. Push Dockerfile and CI workflow to `develop` branch
2. Configure GitHub secrets in repository settings
3. Commit ArgoCD manifests to `minhdqdev-argocd-config` repository
4. Create ArgoCD application in cluster
5. Trigger first build by pushing to `develop`
6. Verify deployment at `http://uat.minhdq.dev`
