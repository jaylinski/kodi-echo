import Options from './../../modules/Options.js';
import { getBrowser } from './../../utils/browser.js';

const browser = getBrowser();
const localStorageOptions = new Options();

function getOptionsFromForm() {
  return {
    ip: document.querySelector('#option_ip').value,
    port: document.querySelector('#option_port').value,
    user: document.querySelector('#option_user').value,
    password: document.querySelector('#option_password').value, // TODO Protect with encryption?
  };
}

function i18n() {
  const toTranslate = document.querySelectorAll('[data-i18n]');
  toTranslate.forEach((element) => {
    element.textContent = browser.i18n.getMessage(element.dataset.i18n);
  });
}

async function save(event) {
  event.preventDefault();
  const options = getOptionsFromForm();
  const optionsSubmitStatus = document.querySelector('#option_submit_status');
  await localStorageOptions.saveToStorage(options);
  optionsSubmitStatus.textContent = '✓';

  // Reset status information.
  window.setTimeout(() => {
    optionsSubmitStatus.textContent = '';
  }, 3000);
}

async function restore() {
  i18n();

  document.querySelector('form').addEventListener('submit', save);

  function setCurrentChoice(options) {
    document.querySelector('#option_ip').value = options.ip || '';
    document.querySelector('#option_port').value = options.port || '';
    document.querySelector('#option_user').value = options.user || '';
    document.querySelector('#option_password').value = options.password || '';
  }

  await localStorageOptions.getFormStorage();
  setCurrentChoice(localStorageOptions);
}

document.addEventListener('DOMContentLoaded', restore);
