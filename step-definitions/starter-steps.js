const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Basic starter steps - customize as needed
Given('I visit the website', async function () {
  await this.goto('/');
});

Then('the website should load successfully', async function () {
  // Basic check that page loaded
  const title = await this.page.title();
  console.log(`Page loaded with title: ${title}`);

  // Take a screenshot
  await this.takeScreenshot('website-loaded');
});
