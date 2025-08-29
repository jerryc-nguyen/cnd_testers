const config = {
  // Feature files location
  paths: ['features/**/*.feature'],

  // Step definitions location
  require: ['step-definitions/**/*.js', 'support/**/*.js'],

  // Output format
  format: [
    'progress-bar',
    'json:cucumber-reports/cucumber-report.json',
    'html:cucumber-reports/cucumber-report.html',
    '@cucumber/pretty-formatter',
  ],

  // Parallel execution
  parallel: 1,

  // Fail fast
  failFast: false,

  // World parameters
  worldParameters: {
    headless: process.env.HEADLESS !== 'false',
    baseURL: process.env.BASE_URL || 'https://chuannhadat.com',
  },

  // Tags
  tags: process.env.TAGS || '',

  // Timeout
  timeout: 60000,
};

module.exports = config;
