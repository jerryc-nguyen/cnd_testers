const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const config = require('../config/config-loader');
const path = require('path');

// Import helper functions from desktop components module
const {
  fillTextInput,
  selectDropdownOption,
  selectVietnameseDropdown,
} = require('../input-helpers/desktop-components');

// Import auth helper functions
const {
  setAuthenticationCookie,
  verifyAuthentication,
} = require('../input-helpers/auths');

// Background steps
Given(
  'I am logged in to chuannhadat.com',
  { timeout: 50000 },
  async function () {
    // Use the auth helper to set authentication cookie
    await setAuthenticationCookie(
      this.page,
      this.config,
      this.baseURL
    );
  }
);

// Navigation step for post creation

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
    // Vietnamese to value mapping for Nhu cầu field
    const valueMap = {
      Bán: 'sell',
      'Cho thuê': 'rent',
    };

    // The Nhu cầu field typically shows "Bán" as default, but we want to change it
    const currentValue = requirement === 'Bán' ? 'Bán' : 'Bán'; // Always look for "Bán" first

    const success = await selectVietnameseDropdown(
      this.page,
      'Nhu cầu',
      requirement,
      valueMap,
      currentValue
    );

    if (!success) {
      await this.takeScreenshot('nhu-cau-select-failed');
      throw new Error(
        `Could not select Nhu cầu value: ${requirement}. Helper function failed.`
      );
    }
  }
);

When(
  'I select Loại bất động sản type {string}',
  async function (propertyType) {
    // Vietnamese to value mapping for property types (based on actual DOM)
    const valueMap = {
      'Căn hộ chung cư': 'can_ho_chung_cu',
      'Nhà riêng': 'nha_rieng',
      'Nhà mặt phố': 'nha_mat_pho',
      Đất: 'dat',
      'Biệt thự liền kề': 'biet_thu_lien_ke',
      'Đất nền dự án': 'dat_nen_du_an',
      'Trang trại/ Khu nghỉ dưỡng': 'trang_trai_khu_nghi_duong',
      'Kho/ Nhà xưởng': 'kho_nha_xuong',
      'Nhà trọ/ Phòng trọ': 'nha_tro_phong_tro',
      'Văn phòng': 'van_phong',
      'Cửa hàng/ Ki-ốt': 'cua_hang_kiot',
      'Bất động sản khác': 'bat_dong_san_khac',
    };

    // The field currently shows "Căn hộ chung cư" as default
    const currentValue = 'Căn hộ chung cư';

    const success = await selectVietnameseDropdown(
      this.page,
      'Loại bất động sản',
      propertyType,
      valueMap,
      currentValue
    );

    if (!success) {
      console.log(
        `TODO: Implement selector for Loại bất động sản type: ${propertyType}`
      );
    }
  }
);

When('I enter the Giá bán {string}', async function (price) {
  const selectors = [
    'input[name="price_in_vnd"]',
    'input[placeholder="Nhập giá bán"]',
  ];

  const success = await fillTextInput(
    this.page,
    'Giá bán',
    price,
    selectors
  );

  if (!success) {
    await this.takeScreenshot('price-input-failed');
    throw new Error(`Could not enter price: ${price}`);
  }
});

When(
  'I enter the Diện tích \\(m²\\) {string}',
  async function (area) {
    const selectors = [
      'input[name="area"]',
      'input[placeholder*="Nhập diện tích"]',
    ];

    const success = await fillTextInput(
      this.page,
      'Diện tích (m²)',
      area,
      selectors
    );

    if (!success) {
      console.log(
        `TODO: Implement selector for Diện tích (m²): ${area}`
      );
    }
  }
);

When('I enter the Số phòng ngủ {string}', async function (bedrooms) {
  const selectors = [
    'input[name="bedrooms_count"]',
    'input[placeholder="Nhập số khác"]',
  ];

  const success = await fillTextInput(
    this.page,
    'Số phòng ngủ',
    bedrooms,
    selectors
  );

  if (!success) {
    console.log(
      `TODO: Implement selector for Số phòng ngủ: ${bedrooms}`
    );
  }
});

When('I enter the Số phòng tắm {string}', async function (bathrooms) {
  const selectors = [
    'input[name="bathrooms_count"]',
    'input[placeholder="Nhập số khác"]',
  ];

  const success = await fillTextInput(
    this.page,
    'Số phòng tắm',
    bathrooms,
    selectors
  );

  if (!success) {
    console.log(
      `TODO: Implement selector for Số phòng tắm: ${bathrooms}`
    );
  }
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
  // Vietnamese to value mapping for legal documents
  const valueMap = {
    'Sổ hồng': 'red_book',
    'Sổ đỏ': 'red_book',
    'Giấy tờ hợp lệ': 'valid_documents',
    'Đang chờ sổ': 'pending_documents',
  };

  const success = await selectVietnameseDropdown(
    this.page,
    'Giấy tờ pháp lý',
    legalDocs,
    valueMap
  );

  if (!success) {
    console.log(
      `TODO: Implement selector for Giấy tờ pháp lý: ${legalDocs}`
    );
  }
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

Then(
  'I should see a success confirmation message',
  async function () {
    console.log(
      'TODO: Verify success confirmation message is displayed'
    );
  }
);

// Screenshot step
Then('I take a screenshot {string}', async function (screenshotName) {
  await this.takeScreenshot(screenshotName);
});
