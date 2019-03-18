import { getBrowser, getBrowserInfo } from './browser.js';

const browser = getBrowser();

/**
 * Get an item from the local storage.
 *
 * This is needed because Firefox uses Promise-based queries and
 * Chrome uses callback-based queries.
 *
 * @param {object} keys
 * @returns {Promise}
 */
async function getLocal(keys) {
  const browserInfo = await getBrowserInfo();

  if (browserInfo.name !== 'Firefox') {
    return new Promise((resolve, reject) => {
      browser.storage.local.get(keys, (result) => {
        if (browser.runtime.lastError) reject();
        resolve(result);
      });
    });
  } else {
    return browser.storage.local.get(keys);
  }
}

/**
 * Save an item to the local storage.
 *
 * This is needed because Firefox uses Promise-based queries and
 * Chrome uses callback-based queries.
 *
 * @param {object} keys
 * @returns {Promise}
 */
async function setLocal(keys) {
  const browserInfo = await getBrowserInfo();

  if (browserInfo.name !== 'Firefox') {
    return new Promise((resolve, reject) => {
      browser.storage.local.set(keys, (result) => {
        if (browser.runtime.lastError) reject();
        resolve(result);
      });
    });
  } else {
    return browser.storage.local.set(keys);
  }
}

export { getLocal, setLocal };
