import { getBrowser } from './browser.js';

const browser = getBrowser();

/**
 * Get the active tab from the active window.
 *
 * @returns {Promise}
 */
async function getActiveTab() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

/**
 * A JavaScript function to inject.
 *
 * This function is serialized and then deserialized for injection.
 * This means that any bound parameters and execution context are lost.
 *
 * @name scriptFunction
 * @function
 */
/**
 * @param {scriptFunction} func
 */
async function executeScriptInActiveTab(func) {
  const activeTab = await getActiveTab();
  return await browser.scripting.executeScript({
    target: {
      tabId: activeTab.id,
    },
    func,
  });
}

export { getActiveTab, executeScriptInActiveTab };
