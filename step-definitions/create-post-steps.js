const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const config = require('../config/config-loader');
const path = require('path');

// Navigation step for post creation (assumes user is already logged in from previous feature)

Given('I navigate to the new post creation page', async function () {
  await this.goto('/dashboard/manage-post/new-post');
  await this.page.waitForLoadState('networkidle');

  // Verify we're on the correct page
  const currentUrl = this.page.url();
  if (!currentUrl.includes('/dashboard/manage-post/new-post')) {
    throw new Error(
      `Expected to be on new post page, but current URL is: ${currentUrl}`
    );
  }

  console.log('Navigated to new post creation page');
});

// Vietnamese form filling steps (empty operations for now)
When(
  'I fill in Nhu cầu field with {string}',
  async function (requirement) {
    console.log(`TODO: Fill in Nhu cầu field with: ${requirement}`);
  }
);

When(
  'I select Loại bất động sản type {string}',
  async function (propertyType) {
    console.log(
      `TODO: Select Loại bất động sản type: ${propertyType}`
    );
  }
);

When('I enter the Giá bán {string}', async function (price) {
  console.log(`TODO: Enter Giá bán: ${price}`);
});

When(
  'I enter the Diện tích \\(m²\\) {string}',
  async function (area) {
    console.log(`TODO: Enter Diện tích (m²): ${area}`);
  }
);

When('I enter the Số phòng ngủ {string}', async function (bedrooms) {
  console.log(`TODO: Enter Số phòng ngủ: ${bedrooms}`);
});

When('I enter the Số phòng tắm {string}', async function (bathrooms) {
  console.log(`TODO: Enter Số phòng tắm: ${bathrooms}`);
});

When('I enter the Dự án {string}', async function (project) {
  console.log(`TODO: Enter Dự án: ${project}`);
});

When('I enter the Tiêu đề {string}', async function (title) {
  console.log(`TODO: Enter Tiêu đề: ${title}`);
});

When(
  'I enter the Nội dung mô tả {string}',
  async function (description) {
    console.log(`TODO: Enter Nội dung mô tả: ${description}`);
  }
);

When('I select Giấy tờ pháp lý {string}', async function (legalDocs) {
  console.log(`TODO: Select Giấy tờ pháp lý: ${legalDocs}`);
});

When('I select Vị trí tầng {string}', async function (floorPosition) {
  console.log(`TODO: Select Vị trí tầng: ${floorPosition}`);
});

When(
  'I select Hướng ban công {string}',
  async function (balconyDirection) {
    console.log(`TODO: Select Hướng ban công: ${balconyDirection}`);
  }
);

When('I select Nội thất {string}', async function (furniture) {
  console.log(`TODO: Select Nội thất: ${furniture}`);
});

// File upload steps
When(
  'I upload property images from local machine',
  async function () {}
);

When('I click the Submit button', async function () {
  const submitButton = await this.page.locator(
    '[data-testid="submitPostBtn"]'
  );

  if (!(await submitButton.isVisible({ timeout: 2000 }))) {
    await this.takeScreenshot('submit-button-not-found');
    throw new Error('Submit button not found');
  }

  await submitButton.click();
  console.log('Clicked submit button');

  // Wait for form submission to process
  const waitTime = config.isLocal() ? 2000 : 5000;
  await this.page.waitForTimeout(waitTime);
});

// Success verification steps
Then('the post should be created successfully', async function () {
  console.log('TODO: Verify post creation success');
});
