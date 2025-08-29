# Environment Configuration Guide

This project supports testing across multiple environments (local, live, staging) with environment-specific configurations.

## 🔧 Configuration Files

### `config/environments.json`
Contains all environment configurations including:
- Base URLs
- Browser settings
- Timeouts
- Debug settings
- Test credentials

### `config/config-loader.js`
Handles loading and switching between environments.

## 🌍 Available Environments

### Local Development (`local`)
- **URL**: `http://localhost:3000`
- **Browser**: Chromium (headed by default)
- **Timeouts**: Shorter for faster feedback
- **Debug**: Screenshots enabled, no video recording

### Live/Production (`live`)
- **URL**: `https://chuannhadat.com`
- **Browser**: Chromium (headless by default)
- **Timeouts**: Longer for network latency
- **Debug**: Full recording and tracing enabled

### Staging (`staging`)
- **URL**: `https://staging.chuannhadat.com`
- **Browser**: Chromium (headless)
- **Timeouts**: Medium timeouts
- **Debug**: Tracing enabled

## 🚀 Running Tests

### Environment-Specific Commands

```bash
# Local environment (with browser visible)
npm run test:local:login

# Live environment (headless)
npm run test:live:login

# Staging environment
npm run test:staging:login

# Run on all environments
npm run test:all-envs

# Run specific tags
npm run test:happy-path
npm run test:login-only
```

### Manual Environment Selection

```bash
# Using environment variable (recommended)
TEST_ENV=local npx cucumber-js features/login.feature
TEST_ENV=live npx cucumber-js features/login.feature

# Using command line argument (alternative)
npx cucumber-js --env=local features/login.feature
npx cucumber-js --env=live features/login.feature
```

## ⚙️ Configuration Priority

1. **Environment variables**: `TEST_ENV=local`
2. **Command line arguments**: `--env=local`
3. **Default**: `local`

## 🔐 Credentials Management

### Update Test Credentials

Edit `config/environments.json`:

```json
{
  "local": {
    "credentials": {
      "username": "your-local-test-user@example.com",
      "password": "your-local-password"
    }
  },
  "live": {
    "credentials": {
      "username": "your-live-test-user@example.com",
      "password": "your-live-password"
    }
  }
}
```

### Using Environment Variables (Override)

```bash
# Override credentials via environment variables
TEST_USERNAME=myuser@example.com TEST_PASSWORD=mypassword npm run test:local:login
```

## 🎯 Feature File Usage

The feature file uses `{configured}` placeholders that automatically use the correct credentials for each environment:

```gherkin
And I enter username "{configured}"
And I enter password "{configured}"
```

## 🐛 Debug Settings

Each environment has different debug settings:

- **Local**: Screenshots only, browser visible
- **Live**: Full recording, tracing, headless
- **Staging**: Tracing enabled, headless

## 📊 Environment Information

When tests run, you'll see configuration details:

```
🔧 Test Configuration:
   Environment: Local Development (local)
   Base URL: http://localhost:3000
   Browser: chromium (headless: false)
   Username: testuser@example.com
   Screenshots: true
   Video Recording: false
```

## 🔄 Switching Environments

### During Development
```bash
# Quick local testing
npm run test:local:login

# Test against live site
npm run test:live:login
```

### In CI/CD
```bash
# Production verification
TEST_ENV=live npm run test:login-only

# Staging validation
TEST_ENV=staging npm run test:happy-path
```

## 📝 Adding New Environments

1. Add configuration to `config/environments.json`
2. Add npm scripts to `package.json`
3. Update this README

Example new environment:
```json
{
  "dev": {
    "name": "Development Server",
    "baseURL": "https://dev.chuannhadat.com",
    "browser": "chromium",
    "headless": false,
    "credentials": {
      "username": "dev-user@example.com",
      "password": "dev-password"
    }
  }
}
```

## 🎉 Benefits

- ✅ **Environment Isolation**: Different configs for different environments
- ✅ **Easy Switching**: Simple command line arguments
- ✅ **Credential Management**: Secure credential handling per environment
- ✅ **Optimized Settings**: Environment-specific timeouts and debug settings
- ✅ **CI/CD Ready**: Easy integration with deployment pipelines
