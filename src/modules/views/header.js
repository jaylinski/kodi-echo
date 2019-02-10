import { html } from './../utils/dom.js';

function getTitle(store) {
  return store.playing ? store.playing.label || store.playing.title : '';
}

export default (store) => html`
  <div class="c-header">
    <div class="c-header__logo"><img src="/assets/icon-48.png" alt="Kodi Logo" /></div>
    <div class="c-header__playing" title="${getTitle(store)}">${getTitle(store)}</div>
  </div>
`;
