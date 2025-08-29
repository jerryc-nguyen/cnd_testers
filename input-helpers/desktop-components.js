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

// Export all helper functions
module.exports = {
  fillTextInput,
  selectDropdownOption,
  selectVietnameseDropdown,
};
