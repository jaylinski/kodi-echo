function BrowserException(message) {
  this.message = message;
  this.name = 'BrowserException';
}

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

  throw new BrowserException('No supported browser found.');
}

/**
 * Return browser info.
 *
 * Currently only works for Firefox.
 *
 * @returns {object}
 */
function getBrowserInfo() {
  try {
    return getBrowser().runtime.getBrowserInfo();
  } catch (e) {
    return {
      name: null,
      vendor: null,
      version: null,
      buildID: null,
    };
  }
}

export { getBrowser, getBrowserInfo };
