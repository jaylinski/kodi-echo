import { getBrowser, getBrowserInfo } from './browser.js';

const browser = getBrowser();

/**
 * Request permissions
 *
 * This is needed because Firefox uses Promise-based queries and
 * Chrome uses callback-based queries.
 *
 * @param {object} permissions
 * @returns {Promise}
 */
async function requestPermissions(permissions) {
  const browserInfo = await getBrowserInfo();

  if (browserInfo.name !== 'Firefox') {
    return new Promise((resolve) => {
      browser.permissions.request(permissions, (result) => {
        resolve(result);
      });
    });
  } else {
    return browser.permissions.request(permissions);
  }
}

export { requestPermissions };
