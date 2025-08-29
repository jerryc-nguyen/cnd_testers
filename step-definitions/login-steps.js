const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const config = require('../config/config-loader');

// Background step
Given('I am on the chuannhadat.com homepage', async function () {
  await this.goto('/');
  await this.page.waitForLoadState('networkidle');

  // Verify we're on the homepage
  const title = await this.page.title();
  console.log(`Loaded homepage with title: ${title}`);
});

// Login button interaction
When('I click on the login button', async function () {
  const loginButton = await this.page.locator(
    '[data-testid="showLoginModalBtn"]'
  );

  if (!(await loginButton.isVisible({ timeout: 2000 }))) {
    await this.takeScreenshot('login-button-not-found');
    throw new Error(
      'Login button not found. Please check the website structure.'
    );
  }

  await loginButton.click();
  console.log('Clicked on login button');
});

// Modal waiting
When('I wait for the login modal to open', async function () {
  const modal = await this.page.locator(
    '[data-testid="loginSubmitBtn"]'
  );

  try {
    await modal.waitFor({
      state: 'visible',
      timeout: this.timeouts.modal,
    });
    console.log('Login modal opened');
    this.loginModal = modal;
  } catch (error) {
    await this.takeScreenshot('no-modal-found');
    throw new Error(
      `Login modal did not open within ${
        this.timeouts.modal / 1000
      } seconds`
    );
  }
});

// Username input
When('I enter username {string}', async function (username) {
  // Use configured credentials if username is a placeholder
  if (
    username === 'testuser@example.com' ||
    username === '{configured}'
  ) {
    username = this.credentials.username;
    console.log(
      `Using configured username for ${config.getEnvironment()} environment`
    );
  }

  const usernameField = await this.page.locator(
    '[data-testid="loginPhoneInput"]'
  );

  if (!(await usernameField.isVisible({ timeout: 2000 }))) {
    await this.takeScreenshot('username-field-not-found');
    throw new Error('Username field not found in the login modal');
  }

  await usernameField.clear();
  await usernameField.fill(username);
  console.log(`Entered username: ${username}`);
});

// Password input
When('I enter password {string}', async function (password) {
  // Use configured credentials if password is a placeholder
  if (
    password === 'validpassword123' ||
    password === '{configured}'
  ) {
    password = this.credentials.password;
    console.log(
      `Using configured password for ${config.getEnvironment()} environment`
    );
  }

  const passwordField = await this.page.locator(
    '[data-testid="loginPasswordInput"]'
  );

  if (!(await passwordField.isVisible({ timeout: 2000 }))) {
    await this.takeScreenshot('password-field-not-found');
    throw new Error('Password field not found in the login modal');
  }

  await passwordField.clear();
  await passwordField.fill(password);
  console.log('Entered password (hidden for security)');
});

// Submit button
When(
  'I click the submit button in the login modal',
  async function () {
    const context = this.page;
    const submitButton = await context.locator(
      '[data-testid="loginSubmitBtn"]'
    );

    if (!(await submitButton.isVisible({ timeout: 2000 }))) {
      await this.takeScreenshot('submit-button-not-found');
      throw new Error('Submit button not found in the login modal');
    }

    await submitButton.click();
    console.log('Clicked submit button');

    // Wait a moment for the form submission to process
    const waitTime = config.isLocal() ? 1000 : 1000; // Shorter wait for local
    await this.page.waitForTimeout(waitTime);
  }
);

// Success assertions
Then('I should be successfully logged in', async function () {
  // Wait for navigation or modal to close (environment-specific timing)
  const waitTime = config.isLocal() ? 1000 : 1000;
  await this.page.waitForTimeout(waitTime);

  // Reload the page to ensure fresh DOM state after login
  await this.page.reload();
  await this.page.waitForLoadState('networkidle');

  // Re-query the DOM directly using document.querySelector to avoid any caching
  // Check for the userLoggedIn flag that gets added to body after successful login
  let loginSuccessful = false;
  const maxAttempts = 20; // 10 seconds with 500ms intervals

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const elementExists = await this.page.evaluate(() => {
      const element = document.querySelector(
        '[data-testid="userLoggedIn"]'
      );
      // For body tag, we don't need to check offsetParent since body is always "visible"
      return element !== null;
    });

    if (elementExists) {
      loginSuccessful = true;
      console.log(
        'Login success detected - userLoggedIn flag found via document.querySelector'
      );
      break;
    }

    await this.page.waitForTimeout(500); // Wait 500ms before next attempt
  }

  if (!loginSuccessful) {
    await this.takeScreenshot('login-success-check-failed');
    throw new Error(
      'Could not verify successful login. userLoggedIn flag not found after 10 seconds.'
    );
  }
});
