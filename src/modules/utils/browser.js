/**
 * Get the browser.
 *
 * This is needed because Firefox and Edge use the `browser` object and
 * Chrome uses uses the non-standard `chrome` object.
 *
 * @returns {object}
 */
function getBrowser() {
  try {
    // Used by Mozilla Firefox and Microsoft Edge.
    return browser;
  } catch (e) {}

  try {
    // Used by Google Chrome.
    return chrome;
  } catch (e) {}

  throw new Error('No supported browser found.');
}

/**
 * Get browser info.
 *
 * Currently only works for Firefox, fallback for Chrome and Edge based on user agent.
 *
 * @returns {Promise}
 */
async function getBrowserInfo() {
  try {
    return getBrowser().runtime.getBrowserInfo();
  } catch (e) {
    return new Promise((resolve) => {
      resolve(getBrowserInfoFromUserAgent());
    });
  }
}

/**
 * Get browser info from user agent.
 *
 * Includes very simple browser detection logic.
 *
 * @returns {object}
 */
function getBrowserInfoFromUserAgent() {
  const userAgent = navigator.userAgent;

  let name = null;
  let vendor = null;
  let version = null;

  if (userAgent.indexOf('webkit')) {
    if (userAgent.indexOf('chrome')) {
      name = 'Chrome';
      vendor = 'Google';
    }
  } else if (userAgent.indexOf('trident') || userAgent.indexOf('msie')) {
    name = 'Edge';
    vendor = 'Microsoft';
  }

  return {
    name,
    vendor,
    version,
    buildID: null,
  };
}

export { getBrowser, getBrowserInfo };
