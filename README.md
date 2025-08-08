# Chuannhadat.com Automation Tests

This project contains Playwright automation tests for testing user form submission flow on [chuannhadat.com](https://chuannhadat.com). The tests are designed to run against the live website to verify that important user flows work correctly after deployments.

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone this repository or navigate to the project directory:
```bash
cd /Users/nhan/learning/testers
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npm run install:browsers
```

## 🧪 Running Tests

### Basic Test Commands

```bash
# Run all tests (headless)
npm test

# Run tests with browser visible (headed mode)
npm run test:headed

# Run tests with Playwright UI mode
npm run test:ui

# Run only smoke test
npm run test:smoke

# Run only form submission tests
npm run test:form

# Debug tests step by step
npm run test:debug

# Show test report
npm run test:report
```

### Test Configuration

Tests are configured to run against the live website at `https://chuannhadat.com`. The configuration is in `playwright.config.js`.

**Browsers tested:**
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)  
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## 📁 Project Structure

```
testers/
├── tests/
│   ├── example.spec.js          # Basic smoke test
│   └── form-submission.spec.js  # Comprehensive form tests
├── test-results/                # Screenshots and test artifacts
├── playwright.config.js         # Playwright configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🎯 Test Coverage

### 1. Smoke Test (`example.spec.js`)
- Verifies website loads successfully
- Takes screenshots for reference
- Basic connectivity test

### 2. Form Submission Tests (`form-submission.spec.js`)
- **Homepage Loading**: Verifies the homepage loads correctly
- **Form Discovery**: Automatically finds contact/registration forms
- **Valid Form Submission**: Tests complete form submission flow with valid data
- **Form Validation**: Tests error handling with invalid/empty data
- **Accessibility**: Checks form accessibility features
- **Mobile Responsiveness**: Tests form on mobile viewports
- **Website Exploration**: Analyzes website structure and available forms

## 🔧 Customizing Tests

### Updating Form Selectors

The tests use flexible selectors to find forms automatically. If you need to update selectors for specific forms, edit the arrays in `form-submission.spec.js`:

```javascript
// Form selectors
const formSelectors = [
  'form[class*="contact"]',
  'form[class*="form"]',
  // Add your specific selectors here
];

// Field selectors  
const fieldMappings = [
  { field: 'name', selectors: ['input[name*="name"]', '[placeholder*="tên"]'] },
  { field: 'email', selectors: ['input[type="email"]', 'input[name*="email"]'] },
  // Add your specific field selectors here
];
```

### Test Data Configuration

Update test data in the `testData` object:

```javascript
const testData = {
  name: 'Playwright Test User',
  email: 'test@example.com',
  phone: '0123456789',
  message: 'This is a test message from Playwright automation',
  company: 'Test Company'
};
```

## 📊 Test Results

### Screenshots
All tests automatically capture screenshots saved to `test-results/`:
- `homepage.png` - Homepage after loading
- `form-found.png` - When form is discovered
- `before-submit.png` - Form filled before submission
- `after-submit.png` - Page after form submission
- `validation-errors.png` - Form validation errors
- `mobile-view.png` - Mobile viewport test
- `homepage-exploration.png` - Website structure analysis

### HTML Reports
After running tests, view detailed reports:
```bash
npm run test:report
```

### Console Output
Tests provide detailed console logging to help understand:
- Which selectors found forms/fields
- Form submission results
- Error states and validation messages

## 🚨 Common Issues & Troubleshooting

### Forms Not Found
If tests can't find forms:
1. Check `test-results/no-form-found.png` screenshot
2. Update form selectors in `form-submission.spec.js`
3. Run the exploration test to analyze website structure

### Browser Installation Issues
```bash
# Reinstall browsers
npx playwright install --force
```

### Network/Timeout Issues
If the website is slow or unreachable:
1. Check internet connection
2. Verify website is accessible: https://chuannhadat.com
3. Increase timeout in `playwright.config.js`

### Form Submission Failures
1. Check `test-results/after-submit.png` to see submission result
2. Verify form fields are filled correctly
3. Check for CAPTCHA or other anti-automation measures
4. Update success/error message selectors

## 🔒 Best Practices

### Running Tests Responsibly
- **Don't spam**: Use reasonable delays between tests
- **Use test data**: Always use obviously fake/test data
- **Monitor rate limits**: Be respectful of the website's resources
- **Clean up**: Don't leave test data in production systems

### Production Testing
- Run tests after deployments to verify functionality
- Set up CI/CD integration for automated testing
- Monitor test results and investigate failures promptly
- Keep tests updated as the website evolves

## 📈 CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v2
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 🤝 Contributing

1. Add new test scenarios as needed
2. Update selectors when website changes
3. Improve error handling and reporting
4. Add more comprehensive validation checks

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review test screenshots in `test-results/`
3. Run tests with `--debug` flag for step-by-step execution
4. Update selectors based on current website structure

---

**Note**: These tests are designed to run against the live production website. Always ensure your tests use appropriate test data and respect the website's terms of service.
