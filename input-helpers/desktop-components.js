// Helper functions for form interactions on desktop components

// Helper function for text input fields
async function fillTextInput(page, fieldName, value, selectors = []) {
  try {
    for (const selector of selectors) {
      try {
        const input = await page.locator(selector);
        if (await input.isVisible({ timeout: 1000 })) {
          await input.clear();
          await input.fill(value);
          console.log(`✅ Entered ${fieldName}: ${value}`);
          return true;
        }
      } catch (error) {
        console.log(
          `Selector "${selector}" failed: ${error.message}`
        );
        continue;
      }
    }
    return false;
  } catch (error) {
    console.log(`❌ Failed to enter ${fieldName}: ${error.message}`);
    return false;
  }
}

// Helper function for dropdown interactions
async function selectDropdownOption(
  page,
  optionText,
  currentValue = null
) {
  try {
    // More specific approach: Find combobox that currently shows the expected value or placeholder
    let comboboxButton;

    if (currentValue) {
      // Look for combobox that currently shows the currentValue
      comboboxButton = await page
        .locator(
          `button[role="combobox"]:has-text("${currentValue}")`
        )
        .first();
    } else {
      // Fallback: look for any combobox (will need to be more specific)
      comboboxButton = await page
        .locator(`button[role="combobox"]`)
        .first();
    }

    if (await comboboxButton.isVisible({ timeout: 2000 })) {
      await comboboxButton.click();
      console.log(`Clicked combobox button to open dropdown`);

      // Wait for dropdown options to appear
      await page.waitForTimeout(500);

      // Click the option with matching text
      const option = await page.locator(
        `[role="option"]:has-text("${optionText}"), [data-value]:has-text("${optionText}")`
      );
      await option.click();
      console.log(`Selected option: ${optionText}`);
      return true;
    }
  } catch (error) {
    console.log(
      `Failed to select option: ${optionText}`,
      error.message
    );
    return false;
  }
  return false;
}

// Helper function for Vietnamese dropdown with value mapping
async function selectVietnameseDropdown(
  page,
  fieldName,
  optionText,
  valueMap = {},
  currentValue = null
) {
  try {
    // Check if the option is already selected
    if (currentValue && currentValue === optionText) {
      console.log(
        `${fieldName} already has the correct value: ${optionText}`
      );
      return true;
    }

    // First try direct text selection with current value context
    const success = await selectDropdownOption(
      page,
      optionText,
      currentValue
    );
    if (success) return true;

    // If direct selection fails and we have a value map, try with mapped value
    if (valueMap[optionText]) {
      const mappedValue = valueMap[optionText];
      console.log(
        `Trying with mapped value: ${optionText} -> ${mappedValue}`
      );

      // Try clicking approach first
      const clickSuccess = await selectDropdownOption(
        page,
        mappedValue,
        currentValue
      );
      if (clickSuccess) return true;

      // Try hidden select approach as fallback
      try {
        console.log(`Trying hidden select approach for ${fieldName}`);
        const hiddenSelect = await page
          .locator('select[aria-hidden="true"]')
          .first();

        if (await hiddenSelect.isVisible({ timeout: 1000 })) {
          await hiddenSelect.selectOption(mappedValue);
          console.log(
            `Selected ${fieldName} via hidden select: ${optionText} (value: ${mappedValue})`
          );
          return true;
        }
      } catch (selectError) {
        console.log(
          `Hidden select approach failed: ${selectError.message}`
        );
      }
    }

    return false;
  } catch (error) {
    console.log(
      `Failed to select ${fieldName}: ${optionText}`,
      error.message
    );
    return false;
  }
}

// Helper function for button + cmdk dropdown input (like Dự án field)
async function buttonCmdkDropdownInput(
  page,
  fieldName,
  searchValue,
  options = {}
) {
  const {
    buttonSelector = 'button[role="combobox"]',
    inputSelector = 'input[cmdk-input]',
    optionSelector = '[cmdk-item]',
    timeout = 2000,
    searchTimeout = 1000,
  } = options;

  try {
    console.log(
      `🔍 Starting ${fieldName} selection with cmdk dropdown`
    );

    // Step 1: Find the button
    const button = await page.locator(buttonSelector);
    if (!(await button.isVisible({ timeout }))) {
      throw new Error(`Button not found for ${fieldName}`);
    }

    // Check if dropdown is already open
    const isOpen =
      (await button.getAttribute('aria-expanded')) === 'true' ||
      (await button.getAttribute('data-state')) === 'open';

    if (!isOpen) {
      await button.click();
      console.log(
        `✅ Clicked ${fieldName} button to open cmdk dropdown`
      );
    } else {
      console.log(`✅ ${fieldName} cmdk dropdown is already open`);
    }

    // Step 2: Wait for the cmdk input to appear
    const cmdkInput = await page.locator(inputSelector);
    if (!(await cmdkInput.isVisible({ timeout: searchTimeout }))) {
      throw new Error(`Cmdk input not found for ${fieldName}`);
    }

    // Step 3: Type the search value in the cmdk input
    await cmdkInput.clear();
    await cmdkInput.fill(searchValue);
    console.log(
      `✅ Typed "${searchValue}" in ${fieldName} cmdk search`
    );

    // Step 4: Wait a moment for search results to appear
    await page.waitForTimeout(800);

    // Step 5: Look for matching options with multiple selector strategies
    let selectedOption = false;
    const selectors = [
      optionSelector,
      '[cmdk-item]',
      '[role="option"]',
      '[data-value]',
      `text="${searchValue}"`,
      `text*="${searchValue.split(' ')[0]}"`, // Try first word if full text fails
    ];

    for (const selector of selectors) {
      try {
        const options_list = await page.locator(selector);
        const optionCount = await options_list.count();

        console.log(
          `🔍 Trying selector "${selector}": found ${optionCount} options`
        );

        if (optionCount > 0) {
          // Click the first matching option
          const firstOption = options_list.first();
          await firstOption.click();
          console.log(
            `✅ Selected first option for "${searchValue}" in ${fieldName} using selector "${selector}"`
          );
          selectedOption = true;
          break;
        }
      } catch (error) {
        console.log(
          `⚠️ Selector "${selector}" failed: ${error.message}`
        );
        continue;
      }
    }

    if (!selectedOption) {
      // Debug: Log what's actually available
      const allElements = await page.locator('*').count();
      console.log(`🔍 Debug: Total elements on page: ${allElements}`);

      // Try to find any clickable elements that might contain the search value
      const possibleOptions = await page
        .locator(`text*="${searchValue}"`)
        .count();
      console.log(
        `🔍 Debug: Elements containing "${searchValue}": ${possibleOptions}`
      );

      throw new Error(
        `No options found for "${searchValue}" in ${fieldName}. Tried ${selectors.length} different selectors.`
      );
    }

    return true;
  } catch (error) {
    console.log(`❌ Failed to select ${fieldName}: ${error.message}`);
    return false;
  }
}

// Helper function for file uploads (like react-dropzone)
async function uploadFiles(page, fieldName, filePaths, options = {}) {
  const {
    inputSelector = 'input[type="file"]',
    dropzoneSelector = '[role="presentation"]',
    timeout = 3000,
    waitForPreviews = true,
    previewSelector = 'img[src*="blob:"], img[alt*="preview"], [data-testid*="preview"], .preview, .thumbnail',
    uploadTimeout = 10000,
  } = options;

  try {
    console.log(`📁 Starting file upload for ${fieldName}`);

    // Find the hidden file input
    const fileInput = await page.locator(inputSelector);
    if (!(await fileInput.isVisible({ timeout: 1000 }))) {
      throw new Error(`File input not found for ${fieldName}`);
    }

    // Upload files to the input
    await fileInput.setInputFiles(filePaths);
    console.log(
      `✅ Uploaded ${filePaths.length} file(s) to ${fieldName}:`
    );
    filePaths.forEach((path, index) => {
      const fileName = path.split('/').pop();
      console.log(`   ${index + 1}. ${fileName}`);
    });

    // Wait for react-dropzone to process and show previews
    if (waitForPreviews) {
      console.log(`🔍 Waiting for preview thumbnails to appear...`);

      try {
        // Wait for preview images to appear (multiple strategies based on actual DOM)
        const previewSelectors = [
          'img[src*="blob:"]', // Blob URLs for previews (primary selector)
          'img[alt*="Hình ảnh"]', // Alt text containing "Hình ảnh" (Vietnamese)
          '[data-rfd-draggable-id]', // React Beautiful DnD draggable items
          '[data-rfd-droppable-id="droppable"] img', // Images inside the droppable container
          '.image-fill-wrapper img', // Images inside the wrapper
          'img[data-nimg="fill"]', // Next.js Image component with fill
          '.cursor-grab img', // Images inside draggable containers
        ];

        let previewsFound = false;
        const expectedCount = filePaths.length;

        for (const selector of previewSelectors) {
          try {
            await page.waitForSelector(selector, { timeout: 3000 });
            const previewCount = await page.locator(selector).count();
            if (previewCount > 0) {
              console.log(
                `✅ Found ${previewCount} preview(s) using selector: ${selector}`
              );

              // Check if we have the expected number of previews
              if (previewCount >= expectedCount) {
                console.log(
                  `🎉 Perfect! Found ${previewCount} previews for ${expectedCount} uploaded files`
                );
              } else {
                console.log(
                  `⚠️ Found ${previewCount} previews but expected ${expectedCount}. Waiting a bit more...`
                );
                await page.waitForTimeout(2000); // Give more time for remaining previews
                const finalCount = await page
                  .locator(selector)
                  .count();
                console.log(`📊 Final preview count: ${finalCount}`);
              }

              previewsFound = true;
              break;
            }
          } catch (error) {
            // Try next selector
            continue;
          }
        }

        if (!previewsFound) {
          // Fallback: wait for any images to appear after upload
          console.log(
            `🔍 No specific previews found, waiting for general image updates...`
          );
          await page.waitForTimeout(2000);

          // Check if any new images appeared
          const allImages = await page.locator('img').count();
          console.log(`📊 Total images on page: ${allImages}`);
        }
      } catch (error) {
        console.log(`⚠️ Preview wait failed: ${error.message}`);
        console.log(
          `🔍 Continuing anyway - files may still be uploaded`
        );
      }
    }

    // Additional wait for upload processing
    await page.waitForTimeout(1000);

    console.log(`✅ File upload process completed for ${fieldName}`);
    return true;
  } catch (error) {
    console.log(
      `❌ Failed to upload files to ${fieldName}: ${error.message}`
    );
    return false;
  }
}

// Helper function to find specific hidden select element by option content
async function findHiddenSelectByOptions(
  page,
  fieldName,
  optionMatchers
) {
  try {
    console.log(`🔍 Looking for hidden select for ${fieldName}`);

    const hiddenSelects = await page.locator(
      'select[aria-hidden="true"]'
    );
    const selectCount = await hiddenSelects.count();
    console.log(`🔍 Found ${selectCount} hidden select elements`);

    // Find the select that contains matching options
    for (let i = 0; i < selectCount; i++) {
      const select = hiddenSelects.nth(i);
      const options = await select
        .locator('option')
        .allTextContents();
      console.log(`🔍 Select ${i} options:`, options);

      // Check if this select contains the expected options
      const hasMatchingOptions = optionMatchers.some((matcher) => {
        if (typeof matcher === 'string') {
          return options.some((opt) => opt.includes(matcher));
        } else if (typeof matcher === 'function') {
          return options.some(matcher);
        }
        return false;
      });

      if (hasMatchingOptions) {
        console.log(`✅ Found ${fieldName} select at index ${i}`);
        return select;
      }
    }

    console.log(`❌ Could not find hidden select for ${fieldName}`);
    return null;
  } catch (error) {
    console.log(
      `❌ Error finding hidden select for ${fieldName}: ${error.message}`
    );
    return null;
  }
}

// Helper function for hidden select dropdown selection with automatic detection
async function selectHiddenDropdown(
  page,
  fieldName,
  optionText,
  valueMap,
  optionMatchers
) {
  try {
    console.log(`🔽 Selecting ${fieldName}: ${optionText}`);

    // Get mapped value
    const mappedValue = valueMap[optionText];
    if (!mappedValue) {
      throw new Error(
        `No mapping found for "${optionText}" in ${fieldName}`
      );
    }

    console.log(`🔍 Mapped "${optionText}" to "${mappedValue}"`);

    // Find the specific hidden select
    const hiddenSelect = await findHiddenSelectByOptions(
      page,
      fieldName,
      optionMatchers
    );

    if (!hiddenSelect) {
      throw new Error(
        `Could not find hidden select for ${fieldName}`
      );
    }

    if (await hiddenSelect.isVisible({ timeout: 3000 })) {
      // Check current value
      const currentValue = await hiddenSelect.inputValue();
      console.log(`📋 Current ${fieldName} value: ${currentValue}`);

      if (currentValue === mappedValue) {
        console.log(
          `✅ ${fieldName} already has correct value: ${optionText}`
        );
        return true;
      }

      // Select the new value
      await hiddenSelect.selectOption({ value: mappedValue });
      console.log(
        `✅ Selected ${fieldName}: ${optionText} (${mappedValue})`
      );

      // Wait for UI to update
      await page.waitForTimeout(1000);
      return true;
    }

    return false;
  } catch (error) {
    console.log(`❌ Failed to select ${fieldName}: ${error.message}`);
    return false;
  }
}

// Export all helper functions
module.exports = {
  fillTextInput,
  selectDropdownOption,
  selectVietnameseDropdown,
  buttonCmdkDropdownInput,
  uploadFiles,
  findHiddenSelectByOptions,
  selectHiddenDropdown,
};
