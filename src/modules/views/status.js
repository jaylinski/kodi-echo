import { html } from './../utils/dom.js';

function noConnection(options, i18n) {
  return html`
    <div class="c-info__status c-info__status--error">
      <p>${i18n.getMessage('statusNoConnection')} (${options.ip}:${options.port})</p>
      <br />
    </div>
  `;
}

function apiError(error, i18n) {
  return html`
    <div class="c-info__status c-info__status--error">
      <p>${i18n.getMessage('statusApiError')}:</p>
      <br />
      <p>${error}</p>
    </div>
  `;
}

export default (store, i18n) => html`
  <div class="c-loader ${store.apiActive ? 'c-loader--show' : ''}"></div>
  <div class="c-info">
    ${!store.apiConnected ? noConnection(store.options, i18n) : ''}
    ${store.apiError ? apiError(store.apiError.message, i18n) : ''}
  </div>
`;
