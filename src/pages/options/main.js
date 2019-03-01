import Options from './../../modules/Options.js';
import { getBrowser } from './../../modules/utils/browser.js';

const browser = getBrowser();
const localStorageOptions = new Options();

/**
 * Anonymize sensitive information (like passwords).
 */
function debugInformationReplacer(key, value) {
  return key === 'password' ? '*'.repeat(value.length) : value;
}

async function printDebugInformation() {
  await localStorageOptions.getFormStorage();
  document.querySelector('#debug').textContent = JSON.stringify(
    {
      manifest: browser.runtime.getManifest(),
      options: localStorageOptions,
    },
    debugInformationReplacer,
    '  '
  );
}

document.addEventListener('DOMContentLoaded', printDebugInformation);
