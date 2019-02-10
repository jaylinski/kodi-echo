import { getBrowser } from './../utils/browser.js';
import { html } from './../utils/dom.js';

const browser = getBrowser();
const actions = {
  options: (event) => {
    event.preventDefault();
    browser.runtime.openOptionsPage();
  },
};

export default (store, i18n, manifest) => html`
  <div class="c-footer">
    <div class="c-footer__name">
      <a href="https://www.github.com/jaylinski/kodi-echo" target="_blank">Kodi Echo</a>
      <span>&nbsp;&bull;&nbsp;</span>
      <a @click="${actions.options}" href="#" target="_blank">${i18n.getMessage('footerOptions')}</a>
      <span>&nbsp;&bull;&nbsp;</span>
      <a @click="${() => store.commit('route', 'help')}" href="#">${i18n.getMessage('footerHelp')}</a>
    </div>
    <div class="c-footer__version"><span>v${manifest.version}</span></div>
  </div>
`;
