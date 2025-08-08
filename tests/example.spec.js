const { test, expect } = require('@playwright/test');

test('basic smoke test for chuannhadat.com', async ({ page }) => {
  // Navigate to the website
  await page.goto('https://chuannhadat.com');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Take screenshot
  await page.screenshot({
    path: 'test-results/smoke-test.png',
    fullPage: true,
  });

  // Basic assertion that page loaded
  await expect(page).toHaveURL(/chuannhadat\.com/);

  console.log('Website loaded successfully!');
});
