import { html } from './../utils/dom.js';

export default (store, i18n, manifest) => html`
  <footer class="c-footer">
    <div class="c-footer__name">
      <a href="${manifest.homepage_url}" target="_blank">${manifest.name}</a>
      <span>&nbsp;&bull;&nbsp;</span>
      <a @click="${() => store.commit('route', 'options')}" href="#">${i18n.getMessage('footerOptions')}</a>
      <span>&nbsp;&bull;&nbsp;</span>
      <a @click="${() => store.commit('route', 'help')}" href="#">${i18n.getMessage('footerHelp')}</a>
    </div>
    <div class="c-footer__version"><span>v${manifest.version}</span></div>
  </footer>
`;
