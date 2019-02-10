import { getBrowser } from './../utils/browser.js';
import { html } from './../utils/dom.js';

const browser = getBrowser();
const actions = {
  options: (event) => {
    event.preventDefault();
    browser.runtime.openOptionsPage();
  },
};

export default (i18n) => html`
  <div class="c-setup">
    <h1 class="c-setup__headline">${i18n.getMessage('setupHeadline')}</h1>
    <p>${i18n.getMessage('setupInstruction')}</p>
    <p><a @click="${actions.options}" href="#">${i18n.getMessage('setupLinkText')}</a></p>
  </div>
`;
