const { test, expect } = require('@playwright/test');

test.describe('chuannhadat.com Form Submission Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Verify page title contains expected text
    await expect(page).toHaveTitle(/chuannhadat/i);

    // Take screenshot for reference
    await page.screenshot({
      path: 'test-results/homepage.png',
      fullPage: true,
    });
  });

  test('should find and interact with contact form', async ({
    page,
  }) => {
    // TODO: Update these selectors based on actual form structure

    // Navigate to contact/form page (update URL as needed)
    // await page.goto('/contact');
    // await page.goto('/lien-he');
    // await page.goto('/dang-ky');

    // Look for common form selectors
    const formSelectors = [
      'form[class*="contact"]',
      'form[class*="form"]',
      'form[id*="contact"]',
      'form[id*="form"]',
      '[data-testid*="form"]',
      '.contact-form',
      '.registration-form',
      '#contact-form',
      '#registration-form',
    ];

    let form = null;
    for (const selector of formSelectors) {
      try {
        const element = page.locator(selector);
        if ((await element.count()) > 0) {
          form = element.first();
          console.log(`Found form with selector: ${selector}`);
          break;
        }
      } catch (error) {
        // Continue trying other selectors
      }
    }

    if (form) {
      await expect(form).toBeVisible();

      // Take screenshot of form
      await page.screenshot({
        path: 'test-results/form-found.png',
        fullPage: true,
      });
    } else {
      console.log(
        'No form found with common selectors. Manual inspection needed.'
      );

      // Take screenshot for manual analysis
      await page.screenshot({
        path: 'test-results/no-form-found.png',
        fullPage: true,
      });
    }
  });

  test('should submit form with valid data', async ({ page }) => {
    // TODO: Update based on actual form structure

    // Example form fields (update based on actual form)
    const testData = {
      name: 'Playwright Test User',
      email: 'test@example.com',
      phone: '0123456789',
      message: 'This is a test message from Playwright automation',
      company: 'Test Company',
    };

    // Navigate to form page
    // await page.goto('/contact'); // Update with actual form URL

    // Fill form fields (update selectors based on actual form)
    // Common field selectors to try
    const fieldMappings = [
      {
        field: 'name',
        selectors: [
          'input[name*="name"]',
          'input[id*="name"]',
          '[placeholder*="tên"]',
          '[placeholder*="name"]',
        ],
      },
      {
        field: 'email',
        selectors: [
          'input[type="email"]',
          'input[name*="email"]',
          'input[id*="email"]',
        ],
      },
      {
        field: 'phone',
        selectors: [
          'input[type="tel"]',
          'input[name*="phone"]',
          'input[name*="sdt"]',
          '[placeholder*="điện thoại"]',
        ],
      },
      {
        field: 'message',
        selectors: [
          'textarea',
          'input[name*="message"]',
          '[placeholder*="tin nhắn"]',
          '[placeholder*="message"]',
        ],
      },
    ];

    for (const { field, selectors } of fieldMappings) {
      for (const selector of selectors) {
        try {
          const element = page.locator(selector);
          if ((await element.count()) > 0) {
            await element.first().fill(testData[field]);
            console.log(
              `Filled ${field} field with selector: ${selector}`
            );
            break;
          }
        } catch (error) {
          // Continue trying other selectors
        }
      }
    }

    // Submit form
    const submitSelectors = [
      'input[type="submit"]',
      'button[type="submit"]',
      'button:has-text("Gửi")',
      'button:has-text("Submit")',
      'button:has-text("Đăng ký")',
      '.submit-btn',
      '.btn-submit',
    ];

    let submitButton = null;
    for (const selector of submitSelectors) {
      try {
        const element = page.locator(selector);
        if ((await element.count()) > 0) {
          submitButton = element.first();
          break;
        }
      } catch (error) {
        // Continue trying other selectors
      }
    }

    if (submitButton) {
      // Wait for any loading states before submission
      await page.waitForLoadState('networkidle');

      // Take screenshot before submission
      await page.screenshot({
        path: 'test-results/before-submit.png',
        fullPage: true,
      });

      // Submit the form
      await submitButton.click();

      // Wait for submission to complete
      await page.waitForLoadState('networkidle');

      // Take screenshot after submission
      await page.screenshot({
        path: 'test-results/after-submit.png',
        fullPage: true,
      });

      // Check for success indicators
      const successIndicators = [
        'text=thành công',
        'text=success',
        'text=cảm ơn',
        'text=thank you',
        '.success-message',
        '.alert-success',
        '[class*="success"]',
      ];

      let successFound = false;
      for (const indicator of successIndicators) {
        try {
          const element = page.locator(indicator);
          if ((await element.count()) > 0) {
            await expect(element.first()).toBeVisible();
            successFound = true;
            console.log(`Success indicator found: ${indicator}`);
            break;
          }
        } catch (error) {
          // Continue checking other indicators
        }
      }

      if (!successFound) {
        console.log(
          'No explicit success message found. Check screenshots for manual verification.'
        );
      }
    } else {
      throw new Error('No submit button found');
    }
  });

  test('should handle form validation errors', async ({ page }) => {
    // TODO: Update based on actual form structure

    // Navigate to form page
    // await page.goto('/contact'); // Update with actual form URL

    // Try to submit empty form to trigger validation
    const submitSelectors = [
      'input[type="submit"]',
      'button[type="submit"]',
      'button:has-text("Gửi")',
      'button:has-text("Submit")',
      '.submit-btn',
    ];

    for (const selector of submitSelectors) {
      try {
        const element = page.locator(selector);
        if ((await element.count()) > 0) {
          await element.first().click();
          break;
        }
      } catch (error) {
        // Continue trying other selectors
      }
    }

    // Wait a moment for validation messages to appear
    await page.waitForTimeout(2000);

    // Take screenshot of validation errors
    await page.screenshot({
      path: 'test-results/validation-errors.png',
      fullPage: true,
    });

    // Check for error messages
    const errorSelectors = [
      '.error-message',
      '.alert-danger',
      '.validation-error',
      '[class*="error"]',
      'text=bắt buộc',
      'text=required',
      'text=invalid',
    ];

    let errorsFound = false;
    for (const selector of errorSelectors) {
      try {
        const elements = page.locator(selector);
        const count = await elements.count();
        if (count > 0) {
          console.log(
            `Found ${count} error element(s) with selector: ${selector}`
          );
          errorsFound = true;
        }
      } catch (error) {
        // Continue checking other selectors
      }
    }

    if (!errorsFound) {
      console.log(
        'No validation errors detected. Form might submit without validation or use different error patterns.'
      );
    }
  });

  test('should test form accessibility', async ({ page }) => {
    // Navigate to form page
    // await page.goto('/contact'); // Update with actual form URL

    // Check for proper form labels and accessibility
    const formElements = await page
      .locator('input, textarea, select')
      .all();

    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      const tagName = await element.evaluate((el) =>
        el.tagName.toLowerCase()
      );
      const type = (await element.getAttribute('type')) || '';
      const id = (await element.getAttribute('id')) || '';
      const name = (await element.getAttribute('name')) || '';

      console.log(
        `Form element ${
          i + 1
        }: ${tagName}[type="${type}"] id="${id}" name="${name}"`
      );

      // Check if element has associated label
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        if ((await label.count()) > 0) {
          console.log(`  ✓ Has associated label`);
        } else {
          console.log(`  ⚠ Missing label for id="${id}"`);
        }
      }

      // Check for placeholder text
      const placeholder = await element.getAttribute('placeholder');
      if (placeholder) {
        console.log(`  ✓ Has placeholder: "${placeholder}"`);
      }
    }

    // Take screenshot for manual accessibility review
    await page.screenshot({
      path: 'test-results/accessibility-review.png',
      fullPage: true,
    });
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to form page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take mobile screenshot
    await page.screenshot({
      path: 'test-results/mobile-view.png',
      fullPage: true,
    });

    // Test form interaction on mobile (if form is found)
    // This would be similar to desktop tests but with mobile-specific considerations

    // Check if form is still usable on mobile
    const form = page.locator('form').first();
    if ((await form.count()) > 0) {
      await expect(form).toBeVisible();
      console.log('Form is visible on mobile viewport');
    }
  });
});

// Utility test to explore the website structure
test.describe('Website Exploration', () => {
  test('explore website structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get page title and URL
    const title = await page.title();
    const url = page.url();
    console.log(`Page title: ${title}`);
    console.log(`Current URL: ${url}`);

    // Find all links on the page
    const links = await page.locator('a[href]').all();
    console.log(`Found ${links.length} links on homepage`);

    const linkData = [];
    for (let i = 0; i < Math.min(links.length, 20); i++) {
      // Limit to first 20 links
      const link = links[i];
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      linkData.push({ href, text: text?.trim() });
    }

    console.log('First 20 links found:');
    linkData.forEach((link, index) => {
      console.log(`${index + 1}. "${link.text}" -> ${link.href}`);
    });

    // Look for forms on homepage
    const forms = await page.locator('form').all();
    console.log(`Found ${forms.length} forms on homepage`);

    // Look for buttons that might lead to forms
    const buttons = await page
      .locator('button, input[type="button"], .btn')
      .all();
    console.log(`Found ${buttons.length} buttons on homepage`);

    // Take full page screenshot
    await page.screenshot({
      path: 'test-results/homepage-exploration.png',
      fullPage: true,
    });

    // Save page source for analysis
    const content = await page.content();
    require('fs').writeFileSync(
      'test-results/homepage-source.html',
      content
    );
  });
});
