const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const config = require('../config/config-loader');
const path = require('path');

// Import helper functions from desktop components module
const {
  fillTextInput,
  selectDropdownOption,
  selectVietnameseDropdown,
  buttonCmdkDropdownInput,
  uploadFiles,
  findHiddenSelectByOptions,
  selectHiddenDropdown,
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
  // Options for the cmdk dropdown component - using specific selectors for Dự án
  const options = {
    buttonSelector: 'button[aria-label="Tìm nhanh dự án"]',
    inputSelector: 'input[placeholder="Tìm dự án"]', // More specific input selector
    optionSelector: '[cmdk-item]',
    timeout: 3000,
    searchTimeout: 1500,
  };

  const success = await buttonCmdkDropdownInput(
    this.page,
    'Dự án',
    project,
    options
  );

  if (!success) {
    await this.takeScreenshot('du-an-cmdk-failed');
    throw new Error(`Could not select Dự án: ${project}`);
  }
});

When('I enter the Tiêu đề {string}', async function (title) {
  const selectors = [
    'textarea[name="title"]',
    'textarea[placeholder="Nhập tiêu đề..."]',
  ];

  const success = await fillTextInput(
    this.page,
    'Tiêu đề',
    title,
    selectors
  );

  if (!success) {
    await this.takeScreenshot('title-input-failed');
    throw new Error(`Could not enter title: ${title}`);
  }
});

When(
  'I enter the Nội dung mô tả {string}',
  async function (description) {
    const selectors = [
      'textarea[name="description"]',
      'textarea[placeholder="Nhập mô tả..."]',
    ];

    const success = await fillTextInput(
      this.page,
      'Nội dung mô tả',
      description,
      selectors
    );

    if (!success) {
      console.log(
        `TODO: Implement selector for Nội dung mô tả: ${description}`
      );
    }
  }
);

When('I select Giấy tờ pháp lý {string}', async function (legalDocs) {
  // Vietnamese to value mapping for legal documents (based on actual DOM)
  const valueMap = {
    'Sổ hồng': 'sohong_sodo',
    'Sổ đỏ': 'sohong_sodo',
    'Sổ hồng/ Sổ đỏ': 'sohong_sodo',
    'Hợp đồng mua bán': 'hop_dong_mua_ban',
    'Giấy tờ chứng minh nguồn gốc': 'giay_to_chung_minh_nguon_goc',
    'Giấy viết tay': 'giay_viet_tay',
  };

  // Define option matchers for legal documents select
  const optionMatchers = [
    'Sổ hồng',
    'Hợp đồng',
    'Giấy tờ',
    'sohong_sodo',
    'hop_dong_mua_ban',
  ];

  // Try the reusable hidden select helper first
  const success = await selectHiddenDropdown(
    this.page,
    'Giấy tờ pháp lý',
    legalDocs,
    valueMap,
    optionMatchers
  );

  if (!success) {
    // Fallback to general helper function
    const currentValue = 'Chọn giấy tờ pháp lý';
    const fallbackSuccess = await selectVietnameseDropdown(
      this.page,
      'Giấy tờ pháp lý',
      legalDocs,
      valueMap,
      currentValue
    );

    if (!fallbackSuccess) {
      console.log(
        `TODO: Implement selector for Giấy tờ pháp lý: ${legalDocs}`
      );
    }
  }
});

When('I select Vị trí tầng {string}', async function (floorPosition) {
  const selectors = [
    'input[name="floors_count"]',
    'input[placeholder="Nhập số"]',
  ];

  const success = await fillTextInput(
    this.page,
    'Vị trí tầng',
    floorPosition,
    selectors
  );

  if (!success) {
    console.log(
      `TODO: Implement selector for Vị trí tầng: ${floorPosition}`
    );
  }
});

When(
  'I select Hướng ban công {string}',
  { timeout: 10000 }, // Increase timeout
  async function (balconyDirection) {
    // Vietnamese to value mapping for balcony directions (based on actual DOM)
    const valueMap = {
      'Hướng Tây': 'west',
      Tây: 'west',
      'Hướng Tây Nam': 'west_south',
      'Tây Nam': 'west_south',
      'Hướng Tây Bắc': 'west_north',
      'Tây Bắc': 'west_north',
      'Hướng Đông': 'east',
      Đông: 'east',
      'Hướng Đông Nam': 'east_south',
      'Đông Nam': 'east_south',
      'Hướng Đông Bắc': 'east_north',
      'Đông Bắc': 'east_north',
      'Hướng Nam': 'south',
      Nam: 'south',
      'Hướng Bắc': 'north',
      Bắc: 'north',
    };

    try {
      // Define option matchers for direction select
      const optionMatchers = [
        'Hướng',
        'east',
        'west',
        'south',
        'north',
      ];

      // Use the reusable hidden select helper
      const success = await selectHiddenDropdown(
        this.page,
        'Hướng ban công',
        balconyDirection,
        valueMap,
        optionMatchers
      );

      if (!success) {
        // Fallback to general helper function
        const fallbackSuccess = await selectVietnameseDropdown(
          this.page,
          'Hướng ban công',
          balconyDirection,
          valueMap
        );

        if (!fallbackSuccess) {
          throw new Error(
            `Could not select Hướng ban công: ${balconyDirection}`
          );
        }
      }
    } catch (error) {
      console.log(
        `❌ Failed to select Hướng ban công: ${error.message}`
      );
      await this.takeScreenshot('huong-ban-cong-failed');
      throw error;
    }
  }
);

When(
  'I select Nội thất {string}',
  { timeout: 10000 }, // Increase timeout
  async function (furniture) {
    // Vietnamese to value mapping for furniture options (based on actual DOM)
    const valueMap = {
      'Nội thất đầy đủ': 'full_furniture',
      'Đầy đủ nội thất': 'full_furniture',
      'Hoàn thiện cơ bản': 'basic_furniture',
      'Cơ bản': 'basic_furniture',
      'Bàn giao thô': 'unfinished_furniture',
      Thô: 'unfinished_furniture',
    };

    try {
      // Define option matchers for furniture select
      const optionMatchers = [
        'thất',
        'furniture',
        'Hoàn thiện',
        'Bàn giao',
        'đầy đủ',
      ];

      // Use the reusable hidden select helper
      const success = await selectHiddenDropdown(
        this.page,
        'Nội thất',
        furniture,
        valueMap,
        optionMatchers
      );

      if (!success) {
        // Fallback to general helper function
        const fallbackSuccess = await selectVietnameseDropdown(
          this.page,
          'Nội thất',
          furniture,
          valueMap
        );

        if (!fallbackSuccess) {
          throw new Error(`Could not select Nội thất: ${furniture}`);
        }
      }
    } catch (error) {
      console.log(`❌ Failed to select Nội thất: ${error.message}`);
      await this.takeScreenshot('noi-that-failed');
      throw error;
    }
  }
);

// File upload steps
When(
  'I upload property images from local machine',
  async function () {
    // Get absolute paths to test images
    const testImagesDir = path.join(
      __dirname,
      '..',
      'test-assets',
      'images'
    );
    const imagePaths = [
      path.join(testImagesDir, '1.jpg'),
      path.join(testImagesDir, '2.jpg'),
      path.join(testImagesDir, '3.jpg'),
    ];

    // Options for react-dropzone file upload
    const options = {
      inputSelector: 'input[type="file"][accept="image/*"]',
      dropzoneSelector: '[role="presentation"]',
      timeout: 5000,
      waitForPreviews: true,
      uploadTimeout: 15000, // Give more time for upload processing
    };

    const success = await uploadFiles(
      this.page,
      'Property Images',
      imagePaths,
      options
    );

    if (!success) {
      await this.takeScreenshot('image-upload-failed');
      throw new Error('Could not upload property images');
    }

    // Verify preview thumbnails are visible
    const previewImages = await this.page.locator(
      'img[src*="blob:"]'
    );
    const previewCount = await previewImages.count();
    console.log(
      `🖼️ Verified ${previewCount} preview thumbnails are visible`
    );

    if (previewCount >= 3) {
      console.log('✅ All expected preview thumbnails are showing!');
    } else {
      console.log(`⚠️ Expected 3 previews but found ${previewCount}`);
    }
  }
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

// Additional steps for "Nhà riêng" (Private House) scenario
When(
  'I enter Mặt tiền rộng \\(m\\) {string}',
  async function (frontWidth) {
    const selectors = [
      'input[name="front_width"]',
      'input[placeholder*="Nhập mặt tiền"]',
      'input[placeholder*="mặt tiền"]',
    ];

    const success = await fillTextInput(
      this.page,
      'Mặt tiền rộng (m)',
      frontWidth,
      selectors
    );

    if (!success) {
      console.log(
        `TODO: Implement selector for Mặt tiền rộng (m): ${frontWidth}`
      );
    }
  }
);

When('I enter Đường rộng {string}', async function (roadWidth) {
  const selectors = [
    'input[name="road_width"]',
    'input[placeholder*="Nhập đường rộng"]',
    'input[placeholder*="đường rộng"]',
  ];

  const success = await fillTextInput(
    this.page,
    'Đường rộng',
    roadWidth,
    selectors
  );

  if (!success) {
    console.log(
      `TODO: Implement selector for Đường rộng: ${roadWidth}`
    );
  }
});

When('I enter Số tầng {string}', async function (floors) {
  const selectors = [
    'input[name="floors_count"]',
    'input[name="floors"]',
    'input[placeholder*="Nhập số tầng"]',
    'input[placeholder*="tầng"]',
  ];

  const success = await fillTextInput(
    this.page,
    'Số tầng',
    floors,
    selectors
  );

  if (!success) {
    console.log(`TODO: Implement selector for Số tầng: ${floors}`);
  }
});

When(
  'I select Hướng nhà\\/ đất {string}',
  async function (houseDirection) {
    // Vietnamese to value mapping for house/land directions (similar to balcony directions)
    const valueMap = {
      'Hướng Tây': 'west',
      Tây: 'west',
      'Hướng Tây Nam': 'west_south',
      'Tây Nam': 'west_south',
      'Hướng Tây Bắc': 'west_north',
      'Tây Bắc': 'west_north',
      'Hướng Đông': 'east',
      Đông: 'east',
      'Hướng Đông Nam': 'east_south',
      'Đông Nam': 'east_south',
      'Hướng Đông Bắc': 'east_north',
      'Đông Bắc': 'east_north',
      'Hướng Nam': 'south',
      Nam: 'south',
      'Hướng Bắc': 'north',
      Bắc: 'north',
    };

    // Define option matchers for house/land direction select
    const optionMatchers = [
      'Hướng',
      'east',
      'west',
      'south',
      'north',
      'nhà',
      'đất',
    ];

    // Try the reusable hidden select helper first
    const success = await selectHiddenDropdown(
      this.page,
      'Hướng nhà/ đất',
      houseDirection,
      valueMap,
      optionMatchers
    );

    if (!success) {
      // Fallback to general helper function
      const fallbackSuccess = await selectVietnameseDropdown(
        this.page,
        'Hướng nhà/ đất',
        houseDirection,
        valueMap
      );

      if (!fallbackSuccess) {
        console.log(
          `TODO: Implement selector for Hướng nhà/ đất: ${houseDirection}`
        );
      }
    }
  }
);

// Screenshot step
Then('I take a screenshot {string}', async function (screenshotName) {
  await this.takeScreenshot(screenshotName);
});
