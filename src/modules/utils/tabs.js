import { getBrowser, getBrowserInfo } from './browser.js';

const browser = getBrowser();
const browserInfo = getBrowserInfo();

/**
 * Execute a script in a tab.
 *
 * This is needed because Firefox uses Promise-based queries and
 * Chrome uses callback-based queries.
 *
 * @param {object} details
 * @returns {Promise}
 */
async function executeScriptTabs(details) {
  if (browserInfo.name !== 'Firefox') {
    return new Promise((resolve, reject) => {
      browser.tabs.executeScript(details, (result) => {
        resolve(result);
      });
    });
  } else {
    return browser.tabs.executeScript(details);
  }
}

/**
 * Query the tabs.
 *
 * This is needed because Firefox uses Promise-based queries and
 * Chrome uses callback-based queries.
 *
 * @param {object} queryInfo
 * @returns {Promise}
 */
async function queryTabs(queryInfo) {
  if (browserInfo.name !== 'Firefox') {
    return new Promise((resolve, reject) => {
      browser.tabs.query(queryInfo, (tabs) => {
        resolve(tabs);
      });
    });
  } else {
    return browser.tabs.query(queryInfo);
  }
}

/**
 * Get the active tab from the active window.
 *
 * @returns {Promise}
 */
async function getActiveTab() {
  const tabs = await queryTabs({ active: true, currentWindow: true });
  return tabs[0];
}

/**
 * @param {string} code
 */
async function executeScriptInActiveTab(code) {
  return await executeScriptTabs({
    code: code,
  });
}

export { queryTabs, getActiveTab, executeScriptInActiveTab };
