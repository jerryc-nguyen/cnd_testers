const {
  setWorldConstructor,
  Before,
  After,
  BeforeAll,
  AfterAll,
} = require('@cucumber/cucumber');
const { chromium, firefox, webkit, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

// Browser and context management
let browser = null;
let context = null;

class CustomWorld {
  constructor({ parameters }) {
    this.parameters = parameters;
    this.page = null;
    this.baseURL = parameters.baseURL || 'https://chuannhadat.com';
    this.headless = parameters.headless !== false;

    // Test data storage
    this.testData = {};
    this.screenshots = [];
  }

  async init() {
    // Create new page for this scenario
    this.page = await context.newPage();

    // Set default timeout
    this.page.setDefaultTimeout(30000);

    // Handle console logs
    this.page.on('console', (msg) => {
      console.log(`Browser console: ${msg.text()}`);
    });

    // Handle page errors
    this.page.on('pageerror', (error) => {
      console.error(`Page error: ${error.message}`);
    });

    return this.page;
  }

  async takeScreenshot(name) {
    if (!this.page) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshot-${name}-${timestamp}.png`;
    const filepath = path.join('test-results', filename);

    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await this.page.screenshot({
      path: filepath,
      fullPage: true,
    });

    this.screenshots.push(filepath);
    console.log(`Screenshot saved: ${filepath}`);
    return filepath;
  }

  async goto(url) {
    if (!this.page) await this.init();

    const fullUrl = url.startsWith('http')
      ? url
      : `${this.baseURL}${url}`;
    await this.page.goto(fullUrl);
    await this.page.waitForLoadState('networkidle');
    return this.page;
  }

  async closePage() {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
  }
}

setWorldConstructor(CustomWorld);

// Hooks
BeforeAll(async function () {
  console.log('🚀 Starting Cucumber tests with Playwright');

  // Choose browser based on environment
  const browserType = process.env.BROWSER || 'chromium';
  const headless = process.env.HEADLESS !== 'false';

  console.log(
    `Using browser: ${browserType} (headless: ${headless})`
  );

  // Launch browser
  switch (browserType) {
    case 'firefox':
      browser = await firefox.launch({ headless });
      break;
    case 'webkit':
      browser = await webkit.launch({ headless });
      break;
    default:
      browser = await chromium.launch({ headless });
  }

  // Create context with options
  const contextOptions = {
    viewport: { width: 1280, height: 720 },
    permissions: ['geolocation'],
    recordVideo: process.env.RECORD_VIDEO
      ? { dir: 'test-results/videos' }
      : undefined,
    trace: process.env.TRACE ? 'on' : 'off',
  };

  // Add mobile device if specified
  if (process.env.DEVICE) {
    const device = devices[process.env.DEVICE];
    if (device) {
      Object.assign(contextOptions, device);
      console.log(`Using device: ${process.env.DEVICE}`);
    }
  }

  context = await browser.newContext(contextOptions);
});

Before(async function () {
  // Initialize page for each scenario
  await this.init();
  console.log(
    `📖 Starting scenario: ${this.pickle?.name || 'Unknown'}`
  );
});

After(async function (scenario) {
  const scenarioName = scenario.pickle?.name || 'unknown';

  // Take screenshot on failure
  if (scenario.result?.status === 'FAILED') {
    await this.takeScreenshot(
      `failed-${scenarioName.replace(/\s+/g, '-')}`
    );
  }

  // Log scenario result
  console.log(
    `✅ Scenario "${scenarioName}" completed with status: ${scenario.result?.status}`
  );

  // Close page
  await this.closePage();
});

AfterAll(async function () {
  console.log('🏁 All tests completed');

  // Close browser context and browser
  if (context) {
    await context.close();
  }
  if (browser) {
    await browser.close();
  }

  console.log('Browser closed successfully');
});

module.exports = { CustomWorld };
