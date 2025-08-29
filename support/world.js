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
const config = require('../config/config-loader');

// Browser and context management
let browser = null;
let context = null;

class CustomWorld {
  constructor({ parameters }) {
    this.parameters = parameters;
    this.page = null;

    // Load configuration
    this.config = config.getConfig();
    this.baseURL = this.config.baseURL;
    this.headless = this.config.headless;
    this.timeouts = this.config.timeouts;
    this.credentials = this.config.credentials;
    this.debugSettings = this.config.debug;
    this.cookies = this.config.cookies;

    // Test data storage
    this.testData = {};
    this.screenshots = [];

    console.log(
      `🌍 World initialized for ${this.config.name} environment`
    );
  }

  async init() {
    // Create new page for this scenario
    this.page = await context.newPage();

    // Set default timeout from configuration
    this.page.setDefaultTimeout(this.timeouts.default);

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

  // Print current configuration
  config.printConfig();

  // Get browser configuration
  const browserConfig = config.getBrowserConfig();
  const browserType = browserConfig.browser;
  const headless = browserConfig.headless;

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

  // Create context with options from configuration
  const debugSettings = config.getDebugSettings();
  const contextOptions = {
    viewport: { width: 1280, height: 720 },
    permissions: ['geolocation'],
    recordVideo: debugSettings.recordVideo
      ? { dir: 'test-results/videos' }
      : undefined,
    trace: debugSettings.trace ? 'on' : 'off',
  };

  // Add slow motion if configured
  if (debugSettings.slowMo > 0) {
    contextOptions.slowMo = debugSettings.slowMo;
  }

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
