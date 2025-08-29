// Helper functions for authentication operations

/**
 * Sets authentication cookie from environment configuration
 * @param {Object} page - Playwright page object
 * @param {Object} config - Environment configuration object
 * @param {string} baseURL - Base URL for the application
 * @returns {Promise<boolean>} - Returns true if cookie was set successfully
 */
async function setAuthenticationCookie(page, config, baseURL) {
  try {
    // First, navigate to the home page
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    console.log('📍 Navigated to home page');

    // Set the token_client cookie from environment configuration
    const cookieConfig = config.cookies;

    if (cookieConfig && cookieConfig.token_client) {
      const cookieToSet = {
        name: 'token-client',
        value: cookieConfig.token_client,
        domain: new URL(baseURL).hostname,
        path: '/',
        httpOnly: false,
        secure: baseURL.startsWith('https'),
        sameSite: 'Lax',
      };

      await page.context().addCookies([cookieToSet]);
      console.log('✅ Cookie set successfully');

      // Verify the cookie was set
      const cookies = await page.context().cookies();
      const frontendTokenCookie = cookies.find(
        (c) => c.name === 'token_client'
      );

      if (frontendTokenCookie) {
        console.log(
          '🔍 Cookie verification: token_client found with value:',
          frontendTokenCookie.value.substring(0, 20) + '...'
        );
      } else {
        console.log(
          '❌ Cookie verification: token_client NOT found in cookies'
        );
        console.log(
          'Available cookies:',
          cookies.map((c) => c.name)
        );
      }

      // Reload the page to apply the authentication cookie
      await page.reload();
      await page.waitForLoadState('networkidle');
      console.log('✅ Page reloaded with authentication cookie');

      return true;
    } else {
      throw new Error(
        'token_client not found in environment configuration'
      );
    }
  } catch (error) {
    console.log(
      `❌ Failed to set authentication cookie: ${error.message}`
    );
    throw error;
  }
}

/**
 * Verifies if user is authenticated by checking for auth indicators
 * @param {Object} page - Playwright page object
 * @returns {Promise<boolean>} - Returns true if user appears to be authenticated
 */
async function verifyAuthentication(page) {
  try {
    // Check for authentication indicators (can be extended as needed)
    const cookies = await page.context().cookies();
    const hasAuthCookie = cookies.some(
      (c) => c.name === 'token-client'
    );

    if (hasAuthCookie) {
      console.log(
        '✅ Authentication verified - token-client cookie found'
      );
      return true;
    } else {
      console.log(
        '❌ Authentication verification failed - no auth cookie found'
      );
      return false;
    }
  } catch (error) {
    console.log(
      `❌ Failed to verify authentication: ${error.message}`
    );
    return false;
  }
}

// Export all auth helper functions
module.exports = {
  setAuthenticationCookie,
  verifyAuthentication,
};
