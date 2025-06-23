# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated testing, building, and deployment of the perpetual-backend application.

## Workflows

### 1. Test Suite (`test.yml`)
**Triggers:** Push to `main`/`develop` branches, Pull Requests
**Purpose:** Run unit tests, security audits, and generate coverage reports

**Features:**
- Tests on multiple Node.js versions (16.x, 18.x, 20.x)
- Runs unit tests with coverage reporting
- Uploads coverage to Codecov
- Runs security audit with npm audit
- Creates test environment variables

### 2. Deploy (`deploy.yml`)
**Triggers:** Push to `main` branch, or after successful test run
**Purpose:** Deploy the application to production environments

**Supported Platforms:**
- **Vercel** (recommended for Node.js apps)
- **Railway** (alternative platform)
- **Render** (alternative platform)

## Setup Instructions

### 1. Repository Secrets

Add these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

#### For Vercel Deployment:
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

#### For Railway Deployment:
```
RAILWAY_TOKEN=your_railway_token
RAILWAY_SERVICE=your_railway_service_name
```

#### For Render Deployment:
```
RENDER_SERVICE_ID=your_render_service_id
RENDER_API_KEY=your_render_api_key
```

### 2. Getting Vercel Credentials

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Get your token: `vercel whoami`
4. Get org and project IDs from your Vercel dashboard or run: `vercel projects`

### 3. Environment Variables

The workflows automatically create environment files for testing. For production, you'll need to set these in your deployment platform:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secure-jwt-secret
MONGO_URI=your-mongodb-connection-string
```

## Workflow Behavior

### On Pull Requests:
- ✅ Runs tests on multiple Node.js versions
- ✅ Generates coverage reports
- ✅ Runs security audit
- ❌ Does NOT deploy (safety)

### On Push to `main`:
- ✅ Runs all tests
- ✅ If tests pass, triggers deployment
- ✅ Deploys to production environment

### On Push to `develop`:
- ✅ Runs all tests
- ❌ Does NOT deploy (development branch)

## Customization

### Adding Linting
If you want to add ESLint, add this to your `package.json`:
```json
{
  "scripts": {
    "lint": "eslint src/ --ext .js",
    "lint:fix": "eslint src/ --ext .js --fix"
  }
}
```

### Adding Integration Tests
For integration tests that need a database, add a MongoDB service to the workflow:
```yaml
services:
  mongodb:
    image: mongo:6.0
    ports:
      - 27017:27017
```

### Adding Docker Support
If you want to build and push Docker images, add this job:
```yaml
docker-build:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: your-username/perpetual-backend:latest
```

## Troubleshooting

### Tests Failing
1. Check that all dependencies are in `package.json`
2. Ensure test environment variables are properly set
3. Verify that test files follow the naming convention: `*.test.js`

### Deployment Failing
1. Verify all required secrets are set in GitHub
2. Check that your deployment platform credentials are correct
3. Ensure your application builds successfully locally

### Coverage Not Uploading
1. Make sure tests are generating coverage reports
2. Check that the `coverage/lcov.info` file exists
3. Verify Codecov integration is set up

## Security Notes

- Never commit sensitive information like API keys or database URLs
- Use GitHub Secrets for all sensitive data
- The test workflows use dummy values for sensitive environment variables
- Production deployments should use real, secure values from your deployment platform

## Support

If you encounter issues with the workflows:
1. Check the Actions tab in your GitHub repository
2. Review the workflow logs for specific error messages
3. Ensure all required secrets and environment variables are properly configured 