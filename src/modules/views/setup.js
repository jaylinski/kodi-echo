import { html } from './../utils/dom.js';

export default (i18n) => html`
  <div class="c-setup">
    <h1 class="c-setup__headline">${i18n.getMessage('setupHeadline')}</h1>
    <p>${i18n.getMessage('setupInstruction')}</p>
  </div>
`;
