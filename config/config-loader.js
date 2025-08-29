const fs = require('fs');
const path = require('path');

class ConfigLoader {
  constructor() {
    this.environments = this.loadEnvironments();
    this.currentEnvironment = this.determineEnvironment();
    this.config = this.loadConfig();
  }

  loadEnvironments() {
    const configPath = path.join(__dirname, 'environments.json');
    try {
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.error(
        'Error loading environments.json:',
        error.message
      );
      throw new Error('Failed to load environment configuration');
    }
  }

  determineEnvironment() {
    // Priority order: environment variable > command line arg > default
    const envFromEnvVar =
      process.env.TEST_ENV || process.env.NODE_ENV;
    if (envFromEnvVar && this.environments[envFromEnvVar]) {
      return envFromEnvVar;
    }

    const envFromArgs = process.argv.find((arg) =>
      arg.startsWith('--env=')
    );
    if (envFromArgs) {
      return envFromArgs.split('=')[1];
    }

    // Default to local
    return 'local';
  }

  loadConfig() {
    const envConfig = this.environments[this.currentEnvironment];
    if (!envConfig) {
      throw new Error(
        `Environment '${this.currentEnvironment}' not found in configuration`
      );
    }

    // Merge with environment variables (if any)
    const config = {
      ...envConfig,
      environment: this.currentEnvironment,
    };

    // Override with environment variables if they exist
    if (process.env.BASE_URL) config.baseURL = process.env.BASE_URL;
    if (process.env.BROWSER) config.browser = process.env.BROWSER;
    if (process.env.HEADLESS !== undefined)
      config.headless = process.env.HEADLESS === 'true';
    if (process.env.TEST_USERNAME)
      config.credentials.username = process.env.TEST_USERNAME;
    if (process.env.TEST_PASSWORD)
      config.credentials.password = process.env.TEST_PASSWORD;

    return config;
  }

  getConfig() {
    return this.config;
  }

  getEnvironment() {
    return this.currentEnvironment;
  }

  getBaseURL() {
    return this.config.baseURL;
  }

  getCredentials() {
    return this.config.credentials;
  }

  getTimeouts() {
    return this.config.timeouts;
  }

  getDebugSettings() {
    return this.config.debug;
  }

  getBrowserConfig() {
    return {
      browser: this.config.browser,
      headless: this.config.headless,
      slowMo: this.config.debug.slowMo,
    };
  }

  // Utility method to check if running locally
  isLocal() {
    return this.currentEnvironment === 'local';
  }

  // Utility method to check if running on live
  isLive() {
    return this.currentEnvironment === 'live';
  }

  // Print current configuration (useful for debugging)
  printConfig() {
    console.log('🔧 Test Configuration:');
    console.log(
      `   Environment: ${this.config.name} (${this.currentEnvironment})`
    );
    console.log(`   Base URL: ${this.config.baseURL}`);
    console.log(
      `   Browser: ${this.config.browser} (headless: ${this.config.headless})`
    );
    console.log(`   Username: ${this.config.credentials.username}`);
    console.log(
      `   Screenshots: ${this.config.debug.takeScreenshots}`
    );
    console.log(
      `   Video Recording: ${this.config.debug.recordVideo}`
    );
    console.log('');
  }
}

// Export singleton instance
const configLoader = new ConfigLoader();
module.exports = configLoader;
