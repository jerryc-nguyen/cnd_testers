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
  // Prioritized selectors: test-specific first, then fallbacks
  const loginSelectors = [
    // 1. Test-specific selectors (most reliable)
    '[data-testid="showLoginModalBtn"]',
  ];

  let loginButton = null;
  for (const selector of loginSelectors) {
    try {
      loginButton = await this.page.locator(selector).first();
      if (await loginButton.isVisible({ timeout: 1000 })) {
        console.log(`Found login button with selector: ${selector}`);
        break;
      }
    } catch (error) {
      // Continue to next selector
      continue;
    }
  }

  if (!loginButton || !(await loginButton.isVisible())) {
    throw new Error(
      'Login button not found. Please check the website structure.'
    );
  }

  await loginButton.click();
  console.log('Clicked on login button');
});

// Modal waiting
When('I wait for the login modal to open', async function () {
  // Prioritized selectors for login modals
  const modalSelectors = [
    // 1. Test-specific selectors (most reliable)
    '[data-testid="showLoginModalBtn"]',
  ];

  let modal = null;
  for (const selector of modalSelectors) {
    try {
      modal = await this.page.locator(selector);
      await modal.waitFor({
        state: 'visible',
        timeout: this.timeouts.modal,
      });
      console.log(`Login modal opened with selector: ${selector}`);
      this.loginModal = modal;
      return;
    } catch (error) {
      // Continue to next selector
      continue;
    }
  }

  // If no modal found, take screenshot for debugging
  await this.takeScreenshot('no-modal-found');
  throw new Error(
    `Login modal did not open within ${
      this.timeouts.modal / 1000
    } seconds`
  );
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
  const usernameSelectors = [
    // 1. Test-specific selectors (most reliable)
    '[data-testid="email-input"]',
    '[data-testid="username-input"]',
    '[data-testid="login-email"]',
    '[data-testid="login-username"]',
    '.test-email-input',
    '.test-username-input',

    // 2. Semantic/ARIA selectors
    'input[aria-label*="email" i]',
    'input[aria-label*="username" i]',
    'input[type="email"]',

    // 3. Name and ID attributes
    'input[name="email"]',
    'input[name="username"]',
    '#email',
    '#username',

    // 4. Placeholder-based (fallback)
    'input[placeholder*="email" i]',
    'input[placeholder*="username" i]',
  ];

  let usernameField = null;
  for (const selector of usernameSelectors) {
    try {
      usernameField = await this.page.locator(selector);
      if (await usernameField.isVisible({ timeout: 2000 })) {
        console.log(
          `Found username field with selector: ${selector}`
        );
        break;
      }
    } catch (error) {
      continue;
    }
  }

  if (!usernameField || !(await usernameField.isVisible())) {
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
  const passwordSelectors = [
    // 1. Test-specific selectors (most reliable)
    '[data-testid="password-input"]',
    '[data-testid="login-password"]',
    '.test-password-input',

    // 2. Semantic/ARIA selectors
    'input[aria-label*="password" i]',
    'input[type="password"]',

    // 3. Name and ID attributes
    'input[name="password"]',
    '#password',
  ];

  let passwordField = null;
  for (const selector of passwordSelectors) {
    try {
      passwordField = await this.page.locator(selector);
      if (await passwordField.isVisible({ timeout: 2000 })) {
        console.log(
          `Found password field with selector: ${selector}`
        );
        break;
      }
    } catch (error) {
      continue;
    }
  }

  if (!passwordField || !(await passwordField.isVisible())) {
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
    const submitSelectors = [
      // 1. Test-specific selectors (most reliable)
      '[data-testid="login-submit"]',
      '[data-testid="login-submit-button"]',
      '[data-testid="signin-submit"]',
      '.test-login-submit',
      '.test-submit-button',

      // 2. Semantic/ARIA selectors
      'button[aria-label*="sign in" i]',
      'button[aria-label*="login" i]',
      'button[type="submit"]',
      'input[type="submit"]',

      // 3. CSS selectors
      '.login-submit',
      '.signin-submit',
      '.submit-button',

      // 4. Text-based selectors (fallback)
      'button:has-text("Sign In")',
      'button:has-text("Login")',
      'button:has-text("Log in")',
    ];

    let submitButton = null;
    for (const selector of submitSelectors) {
      try {
        // Look within the modal if we have it
        const context = this.loginModal || this.page;
        submitButton = await context.locator(selector);
        if (await submitButton.isVisible({ timeout: 2000 })) {
          console.log(
            `Found submit button with selector: ${selector}`
          );
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!submitButton || !(await submitButton.isVisible())) {
      await this.takeScreenshot('submit-button-not-found');
      throw new Error('Submit button not found in the login modal');
    }

    await submitButton.click();
    console.log('Clicked submit button');

    // Wait a moment for the form submission to process
    const waitTime = config.isLocal() ? 1000 : 3000; // Shorter wait for local
    await this.page.waitForTimeout(waitTime);
  }
);

// Success assertions
Then('I should be successfully logged in', async function () {
  // Wait for navigation or modal to close (environment-specific timing)
  const waitTime = config.isLocal() ? 2000 : 5000;
  await this.page.waitForTimeout(waitTime);

  // Check for success indicators
  const successIndicators = [
    // URL change indicators
    () => this.page.url().includes('/dashboard'),
    () => this.page.url().includes('/profile'),
    () => this.page.url().includes('/account'),

    // Element indicators
    async () => {
      const logoutButton = this.page.locator(
        'button:has-text("Logout"), a:has-text("Logout")'
      );
      return await logoutButton.isVisible({ timeout: 5000 });
    },
    async () => {
      const userMenu = this.page.locator(
        '[data-testid="user-menu"], .user-menu, .profile-menu'
      );
      return await userMenu.isVisible({ timeout: 5000 });
    },
    async () => {
      const welcomeMessage = this.page.locator(
        ':has-text("Welcome"), :has-text("Dashboard")'
      );
      return await welcomeMessage.isVisible({ timeout: 5000 });
    },
  ];

  let loginSuccessful = false;
  for (const indicator of successIndicators) {
    try {
      const result = await indicator();
      if (result) {
        loginSuccessful = true;
        console.log('Login success detected');
        break;
      }
    } catch (error) {
      // Continue checking other indicators
      continue;
    }
  }

  if (!loginSuccessful) {
    await this.takeScreenshot('login-success-check-failed');
    throw new Error(
      'Could not verify successful login. No success indicators found.'
    );
  }
});

Then(
  'I should be able to access post creation features',
  async function () {
    // Check for post creation elements after successful login
    const postCreationSelectors = [
      // 1. Test-specific selectors (most reliable)
      '[data-testid="create-post-button"]',
      '[data-testid="new-post-button"]',
      '[data-testid="write-post-button"]',
      '[data-testid="compose-button"]',
      '.test-create-post',
      '.test-new-post',

      // 2. ARIA and semantic selectors
      'button[aria-label*="create post" i]',
      'button[aria-label*="new post" i]',
      'a[aria-label*="create post" i]',

      // 3. Stable CSS selectors
      '.create-post-button',
      '.new-post-button',
      '.write-button',
      '.compose-button',

      // 4. Text-based selectors (fallback)
      'button:has-text("Create Post")',
      'button:has-text("New Post")',
      'button:has-text("Write")',
      'button:has-text("Compose")',
      'a:has-text("Create Post")',
      'a:has-text("New Post")',
      'a:has-text("Write")',

      // 5. URL-based checks
      () => this.page.url().includes('/create'),
      () => this.page.url().includes('/post'),
      () => this.page.url().includes('/write'),
      () => this.page.url().includes('/compose'),
    ];

    let postCreationAccessible = false;
    for (const selector of postCreationSelectors) {
      try {
        if (typeof selector === 'function') {
          // Handle URL checks
          const result = await selector();
          if (result) {
            console.log('Post creation area accessible via URL');
            postCreationAccessible = true;
            break;
          }
        } else {
          // Handle element checks
          const element = await this.page.locator(selector);
          if (await element.isVisible({ timeout: 5000 })) {
            console.log(
              `Post creation feature found with selector: ${selector}`
            );
            postCreationAccessible = true;
            break;
          }
        }
      } catch (error) {
        continue;
      }
    }

    if (!postCreationAccessible) {
      // Try to navigate to common post creation URLs to verify access
      const postCreationUrls = [
        '/create',
        '/post/new',
        '/write',
        '/compose',
      ];

      for (const url of postCreationUrls) {
        try {
          await this.page.goto(`${this.baseURL}${url}`);
          await this.page.waitForLoadState('networkidle');

          // Check if we're not redirected back to login
          const currentUrl = this.page.url();
          if (
            !currentUrl.includes('login') &&
            !currentUrl.includes('signin')
          ) {
            console.log(
              `Successfully accessed post creation at: ${url}`
            );
            postCreationAccessible = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }
    }

    if (!postCreationAccessible) {
      await this.takeScreenshot('post-creation-not-accessible');
      throw new Error(
        'Post creation features not accessible after login. Login may have failed.'
      );
    }

    console.log(
      '✅ Login successful - post creation features are accessible'
    );
  }
);

// Screenshot step
When('I take a screenshot {string}', async function (screenshotName) {
  await this.takeScreenshot(screenshotName);
});
