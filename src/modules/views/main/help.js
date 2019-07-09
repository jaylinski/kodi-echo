import { html } from './../../utils/dom.js';

export default (i18n) => html`
  <div class="c-section__content c-help">
    <h1 class="c-help__headline">${i18n.getMessage('helpHeadline')}</h1>
    <p>${i18n.getMessage('helpText')}</p>
    <ul>
      <li><a href="https://github.com/jaylinski/kodi-echo/issues" target="_blank">GitHub Issues</a></li>
      <li><a href="https://addons.mozilla.org/firefox/addon/echo-for-kodi/" target="_blank">Firefox Add-on</a></li>
    </ul>
  </div>
`;
