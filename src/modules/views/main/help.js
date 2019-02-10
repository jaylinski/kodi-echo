import { html } from './../../utils/dom.js';

export default (i18n) => html`
  <div class="c-section__content c-help">
    <h1 class="c-help__headline">${i18n.getMessage('helpHeadline')}</h1>
    <p>${i18n.getMessage('helpText')}</p>
    <ul>
      <li><a href="https://github.com/jaylinski/kodi-echo/issues" target="_blank">GitHub Issues</a></li>
      <!--
        TODO Insert links to extension stores
        <li>
          <a href="" target="_blank">Chrome Web Store</a>
        </li>
        <li>
          <a href="" target="_blank">Firefox Add-ons</a>
        </li>
      -->
    </ul>
  </div>
`;
